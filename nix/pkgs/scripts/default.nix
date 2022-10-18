{ writeShellApplication
, coreutils
, docker
, flyctl
, formats
, gnugrep
, hackworth-codes-logging-docker-image
, primer-service-docker-image
, primer-service-rev
, primer-sqitch
, procps
, runCommand
, tailscale
, vector
}:

let
  deploy-primer-service = writeShellApplication {
    name = "deploy-primer-service";
    runtimeInputs = [
      docker
      flyctl
      gnugrep
      primer-sqitch
      procps
    ];
    text = ''
      IMAGE=$(docker load --quiet < "${primer-service-docker-image}" | grep -Po 'Loaded image: \Kprimer-service:.*')

      function rm-image() {
        docker rmi "$IMAGE"
      }
      trap rm-image EXIT

      echo "Loaded image: $IMAGE"

      trap 'pkill -P $$; exit' SIGINT SIGTERM
      flyctl proxy 5432 -a hackworth-code-postgres &

      sleep 10
      primer-sqitch deploy --verify db:"$DATABASE_URL"
      flyctl deploy --image "$IMAGE" --image-label "git-${primer-service-rev}"
    '';
  };

  deploy-hackworth-codes-logging = writeShellApplication {
    name = "deploy-hackworth-codes-logging";
    runtimeInputs = [
      docker
      flyctl
      gnugrep
      primer-sqitch
      procps
    ];
    text = ''
      IMAGE=$(docker load --quiet < "${hackworth-codes-logging-docker-image}" | grep -Po 'Loaded image: \Khackworth-codes-logging:.*')

      function rm-image() {
        docker rmi "$IMAGE"
      }
      trap rm-image EXIT

      echo "Loaded image: $IMAGE"

      trap 'pkill -P $$; exit' SIGINT SIGTERM
      flyctl deploy --image "$IMAGE"
    '';
  };


  # Vector config for our Fly.io log shipper.
  #
  # This is hard-wired to work with our logging service, but most of
  # the configuration comes from
  # https://github.com/superfly/fly-log-shipper/blob/main/vector-configs/vector.toml.
  #
  # We can't use that shipper image directly because our Loki service
  # is fronted by a Cloudflare Access proxy whose token-based
  # authentication mechanism is incompatible with Vector's Loki sink,
  # so we co-opt its config here, hardware the bits that are specific
  # to our logging service, and then use Tailscale to ship the logs
  # securely to our Loki.

  toToml = formats.toml { };
  toJson = formats.json { };
  validatedVectorConfig = file: runCommand "validate-vector-conf"
    {
      nativeBuildInputs = [ vector ];
    } ''
    vector validate --no-environment "${file}"
    ln -s "${file}" "$out"
  '';

  vectorConfig = toToml.generate "vector.toml"
    (
      let
        flyDotIoMetrics = "0.0.0.0:9598";
        flyDotIoNats = "nats://[fdaa::3]:4223";
        flyDotIoLogsSubject = "logs.>";
        flyDotIoOrg = "hackworth-ltd";

        # Yes, it's HTTP, not HTTPS -- we're logging via Tailscale.
        lokiEndpoint = "http://log-a.hackworthltd.com.beta.tailscale.net:3100";
      in
      {
        sources.internal_metrics = {
          type = "internal_metrics";
        };

        # Note: this just exports Vector's own metrics from this log
        # shipper instance. We don't use this service to collect metrics
        # from Hackworth Codes as Fly.io already does that for us.
        sinks.prometheus = {
          type = "prometheus_exporter";
          inputs = [
            "internal_metrics"
          ];
          address = flyDotIoMetrics;
        };

        sources.nats = {
          type = "nats";
          url = flyDotIoNats;
          subject = flyDotIoLogsSubject;
          connection_name = "Fly logs stream";

          # This is needed for only-once log delivery in the event that
          # two or more log shipper instances are running at the same time
          # (e.g., during a deployment).
          queue = "hackworth-codes-logging";

          auth.strategy = "user_password";
          auth.user_password.user = flyDotIoOrg;
          auth.user_password.password = "\${FLY_ACCESS_TOKEN}";
        };

        transforms.log_json = {
          type = "remap";
          inputs = [
            "nats"
          ];
          source = ''
            . = parse_json!(.message)
          '';
        };

        sources.internal_logs = {
          type = "internal_logs";
        };

        # This is used for debugging and is taken directly from the
        # Fly.io log shipper app. I'm not sure we need it long-term, but
        # let's include it for now.
        sinks.blackhole = {
          type = "blackhole";
          inputs = [
            "log_json"
          ];
          print_interval_secs = 100000;
        };

        # This comes from
        # https://github.com/superfly/fly-log-shipper/blob/main/vector-configs/sinks/loki.toml
        transforms.loki_json = {
          type = "remap";
          inputs = [
            "log_json"
          ];
          source = ''
            .level = .log.level
            if starts_with(.message, "{") ?? false {
              # parse json messages
              json = object!(parse_json!(.message))
              del(.message)
              . |= json
            }
          '';
        };

        # Note: no auth defined here because we're logging directly to
        # Loki via Tailscale. This should be rectified (for
        # defense-in-depth, at the very least) but our Cloudflare
        # Access auth proxy is incompatible with Vector's supported
        # auth mechanisms at the moment.
        sinks.loki = {
          type = "loki";
          inputs = [
            "loki_json"
          ];
          endpoint = lokiEndpoint;
          out_of_order_action = "accept";
          encoding.codec = "json";
          labels.event_provider = "{{event.provider}}";
          labels.fly_region = "{{fly.region}}";
          labels.fly_app_name = "{{fly.app.name}}";
          labels.fly_app_instance = "{{fly.app.instance}}";
          labels.host = "{{host}}";
          labels.level = "{{level}}";
        };
      }
    );


  # Docker entrypoint for our Hackworth Codes logging service. It uses
  # Tailscale to communicate with our logging services.
  #
  # Note that there are some imperative setup steps required before
  # this will work. Create a Fly.io app named
  # `hackworth-codes-logging` and then see this document to configure
  # Tailscale:
  #
  # https://tailscale.com/kb/1132/flydotio/
  #
  # Note also that as of 2022-10-18, that document does not explain
  # that the "Reusable" flag should also be set for the generated auth
  # key, at least for our purposes and needs. See
  # https://github.com/tailscale/tailscale/issues/5982 for details.
  hackworth-codes-logging-entrypoint = writeShellApplication {
    name = "hackworth-codes-logging-entrypoint";
    runtimeInputs = [
      coreutils
      tailscale
      vector
    ];
    text = ''
      if [ -z ''${TAILSCALE_AUTHKEY+x} ]; then
        echo "TAILSCALE_AUTHKEY is not set, exiting." >&2
        exit 1
      fi
      if [ -z ''${FLY_ACCESS_TOKEN+x} ]; then
        echo "FLY_ACCESS_TOKEN is not set, exiting." >&2
        exit 1
      fi
      tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock &

      function tailscale-logout() {
        tailscale logout
      }
      trap tailscale-logout EXIT SIGINT SIGTERM

      tailscale up --authkey="$TAILSCALE_AUTHKEY" --hostname=hackworth-codes-logging
      exec vector --config "${validatedVectorConfig vectorConfig}"
    '';
  };
in
{
  inherit deploy-primer-service;
  inherit hackworth-codes-logging-entrypoint;
  inherit deploy-hackworth-codes-logging;
}
