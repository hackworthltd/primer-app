{ gnused
, writeShellApplication
}:
let
  bump-primer = writeShellApplication {
    name = "bump-primer";
    runtimeInputs = [
      gnused
    ];
    # Use `builtins.readFile` here so that we get a shellcheck.
    text = builtins.readFile ./bump-primer.sh;
  };
in
bump-primer
