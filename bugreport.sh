#!/usr/bin/env bash

USAGE=$(cat <<EOF
Gathers information about your development environment. Please submit
the output of this program in your bug reports.
EOF
)

PROGRAM=$(basename "$0")

usage () {
    echo "Usage: $PROGRAM [--no-nix]" >&2
    echo >&2
    echo "$USAGE" >&2
}

SKIP_NIX_CHECK=
optspec=":-:"
while getopts "$optspec" optchar; do
    case "${optchar}" in
        -)
            case "${OPTARG}" in
                no-nix)
                    SKIP_NIX_CHECK=1
                    ;;
                *)
                    usage
                    exit 1
                    ;;
            esac;;
        *)
            usage
            exit 1
            ;;
    esac
done
shift $((OPTIND-1))

if [ "$#" -ne 0 ]; then
    usage
    exit 1
fi

if ! [ -d .git ] || ! [ -f flake.nix ] || ! [ -f bugreport.sh ]; then
    echo "Please run this script from the root of the Primer App repository." >&2
    exit 2
fi

echo ""
echo "Primer App development bug reporting tool"
echo ""


NIXBUILD_COMMAND="$(command -v nix-build)"
NIX_FLAKE_ENABLED=$(nix flake info 2>/dev/null)

if [ -z "$SKIP_NIX_CHECK" ]; then
    if ! [ -x "$NIXBUILD_COMMAND" ]; then
        echo "You appear not to have Nix installed."
        echo ""
        echo "We highly recommend that you install Nix and use the project's"
        echo "included flake to develop Primer App. We can provide better support"
        echo "for this workflow. See here for information on how to install Nix:"
        echo ""
        echo "https://nixos.org/download.html"
        echo ""
        echo "Otherwise, please run this script again with the '--no-nix' flag"
        echo "to skip this check."
        exit 3
    elif [ -z "${IN_NIX_SHELL+x}" ]; then
        if [ -z "${NIX_FLAKE_ENABLED+x}" ]; then
            echo "Note: you appear to have Nix installed, but flakes are not enabled."
            echo ""
            echo "We recommend that you enable flakes and use the project's included"
            echo "flake to develop Primer App. We can provide better support for this"
            echo "workflow. See here for information on how to enable flakes:"
            echo ""
            echo "https://nixos.org/manual/nix/stable/command-ref/conf-file.html?highlight=configuration#conf-experimental-features"
            echo ""
            echo "If you're intentionally not using Nix flakes to develop Primer App,"
            echo "please run this script again with the '--no-nix' flag to skip this check."
            exit 4
        else
            echo "You appear to be using Nix with flakes enabled."
            echo ""
            echo "If you're using Nix to develop Primer App, please run this script via"
            echo "the following command:"
            echo ""
            echo "  nix develop --command ./$PROGRAM"
            echo ""
            echo "If you're not using Nix to develop Primer App, we highly recommend"
            echo "that you do so, as we can provide better support for this workflow."
            echo "Otherwise, please run this script again with the '--no-nix' flag"
            echo "to skip this check."
            exit 5
        fi
    fi
fi

echo "If you're submitting a developer bug report, please include"
echo "the output below the separator line in your bug report."
echo ""
echo "Note that the report includes paths to relevant commands,"
echo "but otherwise doesn't contain any personal information."
echo "------------------------------------------------------------"
if [ -z "${IN_NIX_SHELL+x}" ]; then
    echo "The bug report script is not running in a Nix shell."
else
    echo "The bug report script is running in a Nix shell."
fi
echo ""

if [ "$SKIP_NIX_CHECK" ]; then
    echo "Note: --no-nix flag was provided."
    echo ""
fi

echo "System:"
UNAME=$(uname -a)
echo "uname is: " "$UNAME"
echo ""

NIXBUILD_VERSION=""
NIX_COMMAND_ENABLED=""
echo "Nix:"
# Note: NIXBUILD_COMMAND was set earlier.
if ! [ -x "$NIXBUILD_COMMAND" ]; then
    echo "nix is not in the PATH."
else
    echo "nix-build path is: " "$NIXBUILD_COMMAND"
    NIXBUILD_VERSION=$(nix-build --version)
    echo "nix-build version is: " "$NIXBUILD_VERSION"

    NIX_COMMAND_ENABLED=$(nix build --version)
    if [ -z "${NIX_COMMAND_ENABLED+x}" ]; then
        echo "nix-command is not enabled"
    else
        echo "nix-command is enabled"
    fi

    # Note: NIX_FLAKE_ENABLED was set earlier.
    if [ -z "${NIX_FLAKE_ENABLED+x}" ]; then
p        echo "flakes are not enabled"
    else
        echo "flakes are enabled"
    fi
fi
echo ""

DIRENV_COMMAND="$(command -v direnv)"
DIRENV_ACTIVE=""
DIRENV_VERSION=""
echo "direnv:"
if ! [ -x "$DIRENV_COMMAND" ]; then
    echo "direnv is not in the PATH."
else
    echo "direnv path is: " "$DIRENV_COMMAND"
    DIRENV_ACTIVE=$(printenv DIRENV_DIR)
    if [ -z "${DIRENV_ACTIVE+x}" ]; then
        echo "direnv is not active"
    else
        echo "direnv is active"
    fi

    DIRENV_VERSION=$(direnv version)
    echo "direnv version is: " "$DIRENV_VERSION"
fi
echo ""

GIT_COMMAND="$(command -v git)"
GIT_VERSION=""
GIT_REV=""
echo "git:"
if ! [ -x "$GIT_COMMAND" ]; then
    echo "git is not in the PATH."
else
    echo "git path is: " "$GIT_COMMAND"
    GIT_VERSION=$(git --version)
    echo "git version is: " "$GIT_VERSION"

    GIT_REV=$(git rev-parse HEAD)
    echo "git revision is: " "$GIT_REV"
fi
echo ""

NODE_COMMAND="$(command -v node)"
NODE_VERSION=""
echo "Node.js:"
if ! [ -x "$NODE_COMMAND" ]; then
    echo "node is not in the PATH."
else
    echo "node path is: " "$NODE_COMMAND"
    NODE_VERSION=$(node --version)
    echo "node version is: " "$NODE_VERSION"
fi
echo ""

PNPM_COMMAND="$(command -v pnpm)"
PNPM_VERSION=""
echo "pnpm:"
if ! [ -x "$PNPM_COMMAND" ]; then
    echo "pnpm is not in the PATH."
else
    echo "pnpm path is: " "$PNPM_COMMAND"
    PNPM_VERSION=$(pnpm --version)
    echo "pnpm version is: " "$PNPM_VERSION"
fi
echo ""

VITE_COMMAND="$(command -v vite)"
VITE_VERSION=""
echo "Vite:"
if ! [ -x "$VITE_COMMAND" ]; then
    echo "vite is not in the PATH."
else
    echo "vite path is: " "$VITE_COMMAND"
    VITE_VERSION=$(vite --version)
    echo "vite version is: " "$VITE_VERSION"
fi
echo ""

TSC_COMMAND="$(command -v tsc)"
TSC_VERSION=""
echo "TypeScript:"
if ! [ -x "$TSC_COMMAND" ]; then
    echo "tsc is not in the PATH."
else
    echo "tsc path is: " "$TSC_COMMAND"
    TSC_VERSION=$(tsc --version)
    echo "tsc version is: " "$TSC_VERSION"
fi
echo ""

exit 0
