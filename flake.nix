{
  description = "Primer's web frontend.";

  inputs = {
    hacknix.url = github:hackworthltd/hacknix;
    nixpkgs.follows = "hacknix/nixpkgs";

    gitignore.url = "github:hercules-ci/gitignore.nix";
    gitignore.inputs.nixpkgs.follows = "nixpkgs";

    flake-utils.url = github:numtide/flake-utils;

    flake-compat.url = github:edolstra/flake-compat;
    flake-compat.flake = false;

    pre-commit-hooks-nix.url = github:cachix/pre-commit-hooks.nix;
    pre-commit-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
    # Fixes aarch64-darwin support.
    pre-commit-hooks-nix.inputs.flake-utils.follows = "flake-utils";

    # Note: don't override any of primer's Nix flake inputs, or else
    # we won't hit its binary cache.
    primer.url = github:hackworthltd/primer/cab2acedc4c730383eda938a4f17e94c63daaddd;
  };

  outputs =
    { self
    , gitignore
    , nixpkgs
    , hacknix
    , flake-utils
    , pre-commit-hooks-nix
    , primer
    , ...
    }@inputs:
    let
      # A flake can get its git revision via `self.rev` if its working
      # tree is clean and its index is empty, so we use that for the
      # program version when it's available.
      #
      # When the working tree is modified or the index is not empty,
      # evaluating `self.rev` is an error. However, we *can* use
      # `self.lastModifiedDate` in that case, which is at least a bit
      # more helpful than returning "unknown" or some other static
      # value. (This should only happen when you `nix run` in a
      # modified repo. Hydra builds will always be working from a
      # clean git repo, of course.)
      version =
        let
          v = self.rev or self.lastModifiedDate;
        in
        builtins.trace "Nix Primer version is ${v}" v;

      forAllSupportedSystems = flake-utils.lib.eachSystem [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];

      forAllTestSystems = flake-utils.lib.eachSystem [
        "x86_64-linux"
        "aarch64-linux"
      ];

      overlay = hacknix.lib.overlays.combine [
        hacknix.overlay
        (final: prev:
          let
          in
          { }
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

        primerPackages = primer.packages.${system};

        pre-commit-hooks =
          let
          in
          pre-commit-hooks-nix.lib.${system}.run {
            src = ./.;
            hooks = {
              prettier.enable = true;
              nixpkgs-fmt.enable = true;

              actionlint = {
                enable = true;
                name = "actionlint";
                entry = "${pkgs.actionlint}/bin/actionlint";
                language = "system";
                files = "^.github/workflows/";
              };
            };

            # Override the default nix-pre-commit-hooks tools with the version
            # we're using.
            #
            # Note that we can't quite get the same `prettier` that
            # we're using in the shell because the latter is installed
            # by `pnpm`, not nixpkgs.
            tools = {
              inherit (pkgs) nixpkgs-fmt;
            };

            excludes = [
              "README.md"
              "package.json"
              "pnpm-lock.yaml"
              ".mergify.yml"
            ];
          };

        scripts = pkgs.callPackage nix/pkgs/scripts {
          primer-service-rev = primer.rev;
          inherit (primerPackages) primer-service-docker-image primer-sqitch;
        };
      in
      {
        packages = {
          inherit (primerPackages) run-primer primer-openapi-spec primer-sqitch;
        } // (pkgs.lib.optionalAttrs (system == "x86_64-linux" || system == "aarch64-linux") {
          inherit (primerPackages) primer-service-docker-image;
          inherit (scripts) deploy-primer-service;
        });

        checks = {
          source-code-checks = pre-commit-hooks;
        };

        apps =
          let
            mkApp = pkg: script: {
              type = "app";
              program = "${pkg}/bin/${script}";
            };
          in
          (pkgs.lib.mapAttrs (name: pkg: mkApp pkg name) {
            inherit (scripts) deploy-primer-service;
            inherit (primerPackages) run-primer primer-openapi-spec primer-sqitch;
          });

        devShell = pkgs.mkShell {
          buildInputs = (with pkgs; [
            actionlint
            flyctl
            nixpkgs-fmt
            nodejs-18_x
            rnix-lsp
          ]);

          # Make sure the Nix shell includes node_modules's bin dir in
          # the path, or else our editors may not see the editor
          # tooling that we include in the Node packaging.
          shellHook =
            let
              local-spec = "./packages/primer-app/primer-api.json";
            in
            ''
              export PATH="$(pwd)/node_modules/.bin:$PATH"

              OPENAPI_SPEC=$(nix-build -A packages.${system}.primer-openapi-spec)
              rm -f ${local-spec}
              ln -s $OPENAPI_SPEC ${local-spec}
              cd packages/primer-app && pnpm generate
            '';
        };
      })

    // {
      hydraJobs = {
        inherit (self) checks packages;

        required =
          let
            pkgs = pkgsFor "x86_64-linux";
          in
          pkgs.releaseTools.aggregate {
            name = "required-nix-ci";
            constituents = builtins.map builtins.attrValues (with self.hydraJobs; [
              packages.x86_64-linux
              packages.aarch64-linux
              packages.aarch64-darwin
              checks.x86_64-linux
              checks.aarch64-linux
              checks.aarch64-darwin
            ]);
            meta.description = "Required Nix CI builds";
          };
      };

      ciJobs = hacknix.lib.flakes.recurseIntoHydraJobs self.hydraJobs;
    };
}
