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
            project = final.yarn2nix-moretea.mkYarnWorkspace {
              inherit src;
              packageOverrides = {
                hackworthltd-primer-app = {
                  # We only need the result of the build for this
                  # package. We can discard everything else, because
                  # we're not going to use it as a dependency of
                  # another package.
                  buildPhase = "yarn --offline build";
                  installPhase =
                    let
                      pname = "@hackworthltd/primer-app";
                    in
                    ''
                      mkdir -p $out
                      cp -r deps/${pname}/dist/* $out
                    '';

                  # Skip the distPhase, we don't need it for this package.
                  distPhase = "true";
                };

                hackworthltd-primer-components = {
                  postBuild = "yarn --offline build";

                  # We don't need node_modules for this package as
                  # it's all `devDependencies` and `peerDependencies`.
                  # This reduces the size of the closure (and the time
                  # required to generate it) significantly.
                  installPhase =
                    let
                      pname = "@hackworthltd/primer-components";
                    in
                    ''
                      mkdir -p $out/libexec/${pname}
                      mv deps $out/libexec/${pname}/deps
                    '';
                };
              };
            };

            storybook = final.yarn2nix-moretea.mkYarnWorkspace {
              inherit src;
              packageOverrides = {
                hackworthltd-primer-components = {
                  # Storybook needs a writable `node_modules`.
                  configurePhase = ''
                    cp -r $node_modules node_modules
                    chmod -R +w node_modules
                  '';

                  # We only need the result of the build for this
                  # package. We can discard everything else, because
                  # we're not going to use it as a dependency of
                  # another package.
                  buildPhase = "yarn --offline build-storybook";
                  installPhase =
                    let
                      pname = "@hackworthltd/primer-app";
                    in
                    ''
                      mkdir -p $out
                      cp -r storybook-static/* $out
                    '';

                  # Skip the distPhase, we don't need it for this package.
                  distPhase = "true";
                };
              };
            };
          in
          {
            inherit nodejs;
            inherit project;
            inherit storybook;
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

        # This package is guaranteed to change whenever the git rev
        # changes. We use this as a forcing function so that Hydra
        # can't cache required builds, which otherwise causes problems
        # for GitHub applications that expect Hydra to report the
        # status of builds to GitHub regardless of whether they're
        # cached or not.
        package-version = pkgs.writeShellScriptBin "package-version" ''
          echo ${version}
        '';
      in
      {
        packages = {
          inherit package-version;
          inherit (pkgs.project) hackworthltd-primer-app hackworthltd-primer-components;
          primer-components-storybook = pkgs.storybook.hackworthltd-primer-components;
        };

        checks = {
          source-code-checks = pre-commit-hooks;
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
