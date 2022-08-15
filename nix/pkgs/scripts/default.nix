{ writeShellApplication
, docker
, gnugrep
, flyctl
, primer-service-docker-image
, primer-service-rev
, primer-sqitch
, procps
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

in
{
  inherit deploy-primer-service;
}

