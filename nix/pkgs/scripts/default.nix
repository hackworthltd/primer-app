{ writeShellApplication
, docker
, gnugrep
, flyctl
, primer-service-docker-image
, primer-service-rev
}:

let
  deploy-primer-service = writeShellApplication {
    name = "deploy-primer-service";
    runtimeInputs = [
      docker
      flyctl
      gnugrep
    ];
    text = ''
      IMAGE=$(docker load --quiet < "${primer-service-docker-image}" | grep -Po 'Loaded image: \Kprimer-service:.*')

      function rm-image() {
        docker rmi "$IMAGE"
      }
      trap rm-image EXIT

      echo "Loaded image: $IMAGE"

      flyctl deploy --image "$IMAGE" --image-label "git-${primer-service-rev}"
    '';
  };

in
{
  inherit deploy-primer-service;
}

