USAGE=$(cat <<EOF
Bump the Primer repo pin used by this repo.

Usage: $0 <new-primer-rev>

This script updates 'flake.nix', 'flake.lock', and any other files
which reference the Primer repo pin.

Note: don't use a git reference like 'main', since this refers to a
branch, and not a specific commit. Always use the SHA of the Primer
git rev that you want to use.

EOF
)

usage () {
    program=$(basename "$0")
    echo "Usage: $program" >&2
    echo >&2
    echo "$USAGE" >&2
}

if [ "$#" -ne 1 ]; then
    usage
    exit 1
fi

if ! [ -f flake.nix ]; then
    echo "error: can't find flake.nix." >&2
    echo "" >&2
    echo "Run this script from the repo's top-level directory." >&2
    exit 2
fi

STATEFULSET_YAML=argocd/base/statefulset.yaml
if ! [ -f "$STATEFULSET_YAML" ]; then
    echo "error: can't find Kustomize stateful set file." >&2
    echo "" >&2
    echo "Please check the following:" >&2
    echo "" >&2
    echo "1. You're running this script from the repo's top-level directory." >&2
    echo "" >&2
    echo "2. No recent changes to the Kustomize app have broken this script." >&2
    exit 2
fi

echo "Replacing flake.nix Primer pin with rev $1."
sed -i "s/\(github:hackworthltd\/primer\)\/\(.*\);/\1\/$1;/g" flake.nix

echo "Updating flake lockfile."
nix flake lock --update-input primer

echo "Replacing Kustomize app container image tag with rev $1."
sed -i "s/\(image: ghcr\.io\/hackworthltd\/primer\-service\-dev\):git\-\(.*\)$/\1:git\-$1/g" "$STATEFULSET_YAML"

echo "Success."
echo "Please run 'nix develop' to ensure all remaining dependencies are updated."

exit 0
