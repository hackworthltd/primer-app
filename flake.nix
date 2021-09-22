{
  description = "Primer's web frontend.";

  inputs = {
    hacknix.url = github:hackworthltd/hacknix;
    nixpkgs.follows = "hacknix/nixpkgs";

    flake-utils.url = github:numtide/flake-utils;

    flake-compat.url = github:edolstra/flake-compat;
    flake-compat.flake = false;

    pre-commit-hooks-nix.url = github:cachix/pre-commit-hooks.nix;
    pre-commit-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    { self
    , nixpkgs
    , hacknix
    , flake-utils
    , pre-commit-hooks-nix
    , ...
    }@inputs:
    let
      forAllSupportedSystems = flake-utils.lib.eachSystem [
        "x86_64-linux"
        "x86_64-darwin"
      ];

      forAllTestSystems = flake-utils.lib.eachSystem [
        "x86_64-linux"
      ];

      overlay = hacknix.lib.overlays.combine [
        hacknix.overlay
        (final: prev:
          let
            nodejs = final.nodejs-16_x;

            src = ./.;
            configurePhase = "ln -s $node_modules node_modules";

            # Force `mkYarnPackage` not to try to build a binary.
            distPhase = "true";

            # We need to use a nixpkgs-provided esbuild for Nix
            # builds, otherwise esbuild will complain that it
            # couldn't be installed.
            ESBUILD_BINARY_PATH = "${final.esbuild}/bin/esbuild";

            project = final.yarn2nix-moretea.mkYarnWorkspace {
              inherit src;

              packageOverrides = rec {
                primer-app = {
                  inherit ESBUILD_BINARY_PATH;
                  inherit configurePhase distPhase;

                  buildPhase = "yarn --offline build";
                  installPhase = "cp -r dist $out";
                };
              };
            };

            project-checks = final.yarn2nix-moretea.mkYarnWorkspace {
              inherit src;

              packageOverrides = rec {
                primer-app = {
                  inherit ESBUILD_BINARY_PATH;
                  inherit configurePhase distPhase;

                  buildPhase = "yarn checks";
                  installPhase = ''
                    mkdir -p $out
                    touch $out/success
                  '';
                };
              };
            };
          in
          {
            inherit nodejs;
            inherit (project) primer-app;
            primer-app-checks = project-checks.primer-app;
          }
        )
      ];

      pkgsFor = system: import nixpkgs {
        inherit system;
        config = {
          allowUnfree = true;
          allowBroken = true;
        };
        overlays = [
          overlay
        ];
      };
    in
    {
      # Note: `overlay` is not per-system like most other flake attributes.
      inherit overlay;
    }

    // forAllSupportedSystems
      (system:
      let
        pkgs = pkgsFor system;

        pre-commit-hooks =
          let
          in
          pre-commit-hooks-nix.lib.${system}.run {
            src = ./.;
            hooks = {
              prettier.enable = true;
              nixpkgs-fmt.enable = true;
            };

            # Override the default nix-pre-commit-hooks tools with the version
            # we're using.
            #
            # Note that we can't quite get the same `prettier` that
            # we're using in the shell because the latter is installed
            # by `npm`, not nixpkgs.
            tools = {
              inherit (pkgs) nixpkgs-fmt;
            };

            excludes = [
              ".github/"
              "README.md"
              "package.json"
              "yarn.lock"
            ];
          };
      in
      {
        packages = {
          inherit (pkgs) primer-app;
        };

        checks = {
          source-code-checks = pre-commit-hooks;
          inherit (pkgs) primer-app-checks;
        };

        devShell = pkgs.mkShell {
          buildInputs = (with pkgs; [
            nodejs
            nixpkgs-fmt
            yarn
          ]);

          # We don't get cute with node_modules, because this project
          # is a Yarn workspace, and its node_modules layout is
          # non-trivial. However, we do want to make sure binaries in
          # the top-level project node_modules are in the shell's
          # path.
          shellHook = ''
            export PATH="$(pwd)/node_modules/.bin:$PATH"
          '';
        };
      })

    // {
      hydraJobs = {
        inherit (self) packages;
        inherit (self) checks;

        required =
          let
            pkgs = pkgsFor "x86_64-linux";
          in
          pkgs.releaseTools.aggregate {
            name = "required";
            constituents = builtins.map builtins.attrValues (with self.hydraJobs; [
              packages.x86_64-linux
              packages.x86_64-darwin
              checks.x86_64-linux
              checks.x86_64-darwin
            ]);
            meta.description = "Required CI builds";
          };
      };

      ciJobs = hacknix.lib.flakes.recurseIntoHydraJobs self.hydraJobs;
    };
}
