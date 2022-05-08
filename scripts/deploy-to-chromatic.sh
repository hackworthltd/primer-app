yarn
if [[ -z "${CHROMATIC_PROJECT_TOKEN:-}" ]]; then
  CHROMATIC_PROJECT_TOKEN_PATH="$HOME/.chromatic/primer-app.token"
  echo "Reading Chromatic project token from $CHROMATIC_PROJECT_TOKEN_PATH"
  CHROMATIC_PROJECT_TOKEN="$(cat "$CHROMATIC_PROJECT_TOKEN_PATH")"
  export CHROMATIC_PROJECT_TOKEN
fi
yarn workspace @hackworthltd/primer-components chromatic
