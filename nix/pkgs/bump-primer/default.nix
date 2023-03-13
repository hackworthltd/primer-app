{ gnused
, nix
, writeShellApplication
}:
let
  bump-primer = writeShellApplication {
    name = "bump-primer";
    runtimeInputs = [
      gnused
      nix
    ];
    # Use `builtins.readFile` here so that we get a shellcheck.
    text = builtins.readFile ./bump-primer.sh;
  };
in
bump-primer
