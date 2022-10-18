{ writeShellApplication
, docker
, flyctl
, gnugrep
, hackworth-codes-logging-docker-image
, primer-app-rev
, primer-service-docker-image
, primer-service-rev
, primer-sqitch
, procps
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
      flyctl deploy --image "$IMAGE" --image-label "git-${primer-app-rev}"
    '';
  };

  # Docker entrypoint for our Hackworth Codes logging service. It uses
  # Tailscale to communicate with our logging services.
  #
  # Note that there are some imperative setup steps required before
  # this will work. Create a Fly.io app named
  # `hackworth-codes-logging` and then see this document to configure
  # Tailscale:
  #
  # https://tailscale.com/kb/1132/flydotio/
  hackworth-codes-logging-entrypoint = writeShellApplication {
    name = "hackworth-codes-logging-entrypoint";
    runtimeInputs = [
      tailscale
      vector
    ];
    text = ''
      if [ -z ''${TAILSCALE_AUTHKEY+x} ]; then
        echo "TAILSCALE_AUTHKEY is not set, exiting." >&2
        exit 1
      fi
      tailscaled --state=/var/lib/tailscale/tailscaled.state --socket=/var/run/tailscale/tailscaled.sock &
      tailscale up --authkey="$TAILSCALE_AUTHKEY" --hostname=hackworth-codes-logging
      while true; do sleep 10 ; done
    '';
  };
in
{
  inherit deploy-primer-service;
  inherit hackworth-codes-logging-entrypoint;
  inherit deploy-hackworth-codes-logging;
}

