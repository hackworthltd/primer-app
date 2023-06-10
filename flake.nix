{
  description = "Primer's web frontend.";

  inputs = {
    hacknix.url = github:hackworthltd/hacknix;
    nixpkgs.follows = "hacknix/nixpkgs";

    gitignore.url = "github:hercules-ci/gitignore.nix";
    gitignore.inputs.nixpkgs.follows = "nixpkgs";

    flake-compat.url = github:edolstra/flake-compat;
    flake-compat.flake = false;

    pre-commit-hooks-nix.url = github:cachix/pre-commit-hooks.nix;
    pre-commit-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";

    # Note: don't override any of primer's Nix flake inputs, or else
    # we won't hit its binary cache.
    primer.url = github:hackworthltd/primer/6fd3dd07ffb1a89b77da9978b5406e61c4acaec7;

    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@ { flake-parts, ... }:
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
          v = inputs.self.rev or inputs.self.lastModifiedDate;
        in
        builtins.trace "Nix primer-app version is ${v}" v;

      allOverlays = [
        inputs.hacknix.overlays.default
        inputs.self.overlays.default
      ];
    in
    flake-parts.lib.mkFlake { inherit inputs; } {
      debug = true;

      imports = [
        inputs.pre-commit-hooks-nix.flakeModule
      ];

      systems = [ "x86_64-linux" "aarch64-darwin" ];

      perSystem = { config, pkgs, system, ... }:
        let
          primerPackages = inputs.primer.packages.${system};

          scripts = pkgs.callPackage nix/pkgs/scripts {
            primer-service-rev = inputs.primer.rev;
            inherit (primerPackages) primer-service-docker-image primer-sqitch;
          };

          bump-primer = pkgs.callPackage ./nix/pkgs/bump-primer { };
        in
        {
          # We need a `pkgs` that includes our own overlays within
          # `perSystem`. This isn't done by default, so we do this
          # workaround. See:
          #
          # https://github.com/hercules-ci/flake-parts/issues/106#issuecomment-1399041045
          _module.args.pkgs = import inputs.nixpkgs
            {
              inherit system;
              config = {
                allowUnfree = true;
                allowBroken = true;
              };
              overlays = allOverlays;
            };

          pre-commit = {
            check.enable = true;
            settings = {
              src = ./.;
              hooks = {
                prettier.enable = true;
                nixpkgs-fmt.enable = true;
                actionlint.enable = true;
              };

              excludes = [
                "CONTRIBUTING.md"
                "DCO.md"
                "README.md"
                "docs"
                "package.json"
                "pnpm-lock.yaml"
              ];
            };
          };

          packages =
            let
            in
            {
              inherit (primerPackages) run-primer-postgresql run-primer-sqlite primer-openapi-spec primer-sqitch;
              inherit bump-primer;
            } // (pkgs.lib.optionalAttrs (system == "x86_64-linux") {
              inherit (primerPackages) primer-service-docker-image;
            });

          apps =
            let
              mkApp = pkg: script: {
                type = "app";
                program = "${pkg}/bin/${script}";
              };
            in
            (pkgs.lib.mapAttrs (name: pkg: mkApp pkg name) {
              inherit (primerPackages) run-primer-postgresql run-primer-sqlite primer-openapi-spec primer-sqitch;
              inherit bump-primer;
            });

          devShells.default = pkgs.mkShell {
            buildInputs = (with pkgs; [
              nixpkgs-fmt
              nodejs_18
              nodejs_18.pkgs.pnpm
              rnix-lsp
            ]);

            # Make sure the Nix shell includes node_modules's bin dir in
            # the path, or else our editors may not see the editor
            # tooling that we include in the Node packaging.
            shellHook =
              let
                spec = inputs.self.packages.${system}.primer-openapi-spec;
                local-spec = "./primer-api.json";
              in
              ''
                export PATH="$(pwd)/node_modules/.bin:$PATH"
                pnpm install
                rm -f ${local-spec}
                ln -s ${spec} ${local-spec}
                pnpm generate
              '';
          };
        };

      flake =
        let
          # See above, we need to use our own `pkgs` within the flake.
          pkgs = import inputs.nixpkgs
            {
              system = "x86_64-linux";
              config = {
                allowUnfree = true;
                allowBroken = true;
              };
              overlays = allOverlays;
            };
        in
        {
          overlays.default = (final: prev: { });

          hydraJobs = {
            inherit (inputs.self) packages;
            inherit (inputs.self) checks;
            inherit (inputs.self) devShells;

            required = pkgs.releaseTools.aggregate {
              name = "required-nix-ci";
              constituents = builtins.map builtins.attrValues (with inputs.self.hydraJobs; [
                packages.x86_64-linux
                packages.aarch64-darwin
                checks.x86_64-linux
                checks.aarch64-darwin
              ]);
              meta.description = "Required CI builds";
            };
          };

          ciJobs = inputs.hacknix.lib.flakes.recurseIntoHydraJobs inputs.self.hydraJobs;
        };
    };
}
