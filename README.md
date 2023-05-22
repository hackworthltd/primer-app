# primer-app

This repo contains the Primer frontend application and related packages.

## License

The source code for this project is licensed under the [GNU Affero General Public License, version 3 or later](https://www.gnu.org/licenses/agpl-3.0.html).

### Third party assets & licenses

Some third-party assets that we distribute together with the project's source code (e.g., open source fonts) are licensed separately from the source code. For each such asset, there's a corresponding license file in the `licenses` subdirectory of the project.

## This repo's relationship to the Primer repo

For a variety of reasons, some historical, this project and the [Primer language Haskell implementation](https://github.com/hackworthltd/primer) upon which it depends live in separate repositories. In order to keep the frontend code in sync with a particular version of the Primer backend/API, we pin the Primer backend repo to a particular git commit/rev via a Nix flake input pin. This ensures that when we run a local `primer-service` instance during development ([see below](#Running-a-local-`primer-service`-instance)), we're running the correct version of the backend for the current frontend, and we don't need to worry about keeping our local copies of these 2 repos in sync. The drawback to this approach is that if we need to make backend changes to accommodate a new frontend feature, we must first commit those changes to the backend repo's `main` branch before we can update the local Nix flake pin. (However, we can always fall back to running the local `primer-service` from a local copy of the backend repo, if necessary.)

To bump the Primer pin, run the following commands from the top-level
directory of this repo, where `abcd123` is the new Primer pin:

```sh
nix run .#bump-primer abcd123
nix develop
```

(The `nix develop` step ensures that this project's API bindings are up to date with Primer's.)

## Build system

We use the [Vite build system](https://vitejs.dev/guide/). While this build system isn't as full-featured as [Create React App](https://create-react-app.dev), it's much simpler, more agile, and significantly faster than [Webpack](https://webpack.js.org), which underpins Create React App and is a major contributor to Create React App's complexity.

We use [`pnpm`](https://pnpm.io/) to manage packages and run commands.

Note that, in this project, we do *not* use Nix in any significant capacity. Nix is used only to install some tooling in the `nix develop` shell, and to run some linting hooks in CI. (We used to use Nix with `yarn2nix`, but we found that it created more problems than it was worth. As of May 2022, the JavaScript ecosystem is not well supported in Nix.)

## Interactive development

To develop interactively, enter the Nix shell via `nix develop`, which will install/update any necessary Node.js packages, and automatically generate the Primer API bindings.

### Running a local `primer-service` instance

In most circumstances, while developing locally, you'll want to launch the version of `primer-service` that is pinned via this repo's `primer` Nix flake input. To do that, run the following command from this project's top-level directory:

```sh
nix run .#run-primer-sqlite
```

### Scripts

#### `pnpm watch`

This command runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) in a browser to interact with it. You can run `pnpm watch --open` to automatically open a browser window.

Thanks to Vite's [hot module reloading feature (HMR)](https://vitejs.dev/guide/features.html#hot-module-replacement), the page will reload automatically whenever you make an edit to any source code or CSS files. (Changing a package's settings in a `.json` or `.js` file may require that you restart the dev server, as these changes are often not automatically picked up.)

In development mode, Vite also runs TypeScript and `eslint` when files change, so you'll see warnings and errors in the console where the `pnpm watch` command is running. There is sometimes a lag between when the browser reloads and the errors & warnings show up, however.

#### `pnpm format`

This runs `prettier --write` on all source files in the project.

#### `pnpm lint` and `pnpm lint:fix`

Runs `eslint` on all source files in the project. The `lint:fix` variant will also attempt to fix any linting issues.

#### `pnpm storybook`

This command builds the project's Storybook, and then serves a local instance of it, which includes support for HMR.  It will automatically open a browser window.  This can be disabled by `pnpm storybook --no-open`.

#### `pnpm build`

This command builds a production version of the frontend application

Once you've built the production version, you can then run `pnpm serve` and open [http://localhost:4173](http://localhost:4173) in a browser to see the production build. (Note: `pnpm serve` does not appear to be compatible with Safari on macOS. You may need to use Firefox or Chrome to view the production build on this platform.)

In theory, the local production version of the application should be no different than the `watch` HMR version, so unless you're trying to debug a production issue locally, `pnpm serve` is probably not what you want.

#### `pnpm generate`

This command automatically generates Primer API bindings for the frontend application. You need only run this whenever you update the `primer-api.json` file, which is generated by our `primer` backend repo. See below for more details.

Note that this command is run automatically every time you enter the `nix develop` shell, to help ensure your generated files are up-to-date with the latest API at all times.

#### `pnpm build-storybook`

This is the deployment-ready version of the component Storybook, the same as the one we deploy to Chromatic for CI builds (see below). You probably won't need to run this command very often.

#### `pnpm chromatic`

This command performs a manual Chromatic deployment. You should never need to do this (and it probably won't work, anyway, as you likely don't have the necessary credentials to deploy to Chromatic).

### Running package scripts & commands

You can use `pnpm` to run scripts and commands that are installed by the various packages in the repo. For example, to use `tsc`, the TypeScript compiler, you can run `pnpm tsc`.

## Other notes

### Calculating reverse dependencies

To find out why one of our packages has a dependency on a particular package, run `pnpm why <package-name>` in that package's subdirectory. For example:

```sh
 pnpm why react

Legend: production dependency, optional only, dev only

@hackworthltd/primer-app@0.2.0 /Users/dhess/git/primer-app

dependencies:
@tanstack/react-query 4.9.0
├── react 18.2.0 peer
├─┬ react-dom 18.2.0 peer
│ └── react 18.2.0 peer
└─┬ use-sync-external-store 1.2.0
  └── react 18.2.0 peer
react 18.2.0
...
```

### Upgrading dependencies

To upgrade the package set for the project, run the following command:

```sh
pnpm upgrade
```

The `pnpm upgrade` command will strictly obey any version bounds specified in the project's `package.json` file. To ignore those bounds and upgrade all packages to their latest versions, run `pnpm upgrade --latest`.

This command will also update the `package.json` file's version bounds, as needed.

### Type-checking in TypeScript

The TypeScript compiler (`tsc`) can perform full type-checking on your TypeScript code, and there are some knobs to set in the per-package `tsconfig.json` file depending on how strict you want it to be. However, most TypeScript projects, including ours, do not use `tsc` to generate object code, both because `tsc` is relatively slow, and because it doesn't produce particularly efficient object code (neither in terms of size nor performance). Most projects use `tsc` only as a sort of opt-in type-checking pass, and it's often combined with other tooling (e.g., `eslint`).

If you're coming from the Haskell or PureScript world, this approach takes some getting used to. For one thing, if you want to enforce type-checking, you must explicitly enable `tsc` passes, either directly by calling `tsc` in the project's build command, or indirectly by adding some configuration to the build system's own configuration. Unfortunately, this configuration is often quite bespoke, and there are a seemingly infinite number of ways (and plugins) to do this.

In our project, we enforce `tsc` and `eslint` passes in production build rules (i.e., usually on `pnpm build` commands), and we try to run them in parallel with/after the object code pass for interactive development. This means that if you make a change during interactive development that compiles without errors in JavaScript but is ill-typed, error messages from the type-checking pass will sometimes show up a few seconds after your browser reloads.

Therefore, you need to be diligent during interactive development to check for type errors, either in the terminal window where you're running the interactive build command, or in your editor, if you've enabled LSP support.

On the other hand, for production builds and CI, you can rest assured that TypeScript will catch type errors, modulo bugs in our build system configuration.

### LSP support and other tooling

We've tried to configure the project such that LSP and other tooling should "just work" in your editor, but you still might need to do some configuration on your end to hook it up. At the very least, the Nix development shell provides binaries for the TypeScript language server and `eslint` support, so you shouldn't need to download these or otherwise install them in your environment. (However, note to Emacs LSP users: it may prompt you whether it should automatically download a helper, and in my experience, this is usually necessary. I haven't gotten to the bottom of why this is required. -- @dhess)

Probably the easiest way to ensure your editor sees the right environment is to add [`direnv`](https://direnv.net) support to your shell & editor, and then use [`nix-direnv`](https://github.com/nix-community/nix-direnv) to ensure that your editor sees the tools that the Nix shell provides. The project includes an `.envrc` file which will do the right thing once you run `direnv allow` in the project root directory.

### CI & Chromatic

We use [Chromatic](https://www.chromatic.com), a commercial service that works with Storybook.js to provide per-component, per-commit visual testing and review. Chromatic is automatically run on every pull request on the [primer-app repo](https://github.com/hackworthltd/primer-app). If a PR causes a visible change to the component library, Chromatic will indicate in that PR's checks/statuses section that an approval is necessary before the PR can be committed. You can click on the "details" link for the "UI Tests" and "UI Review" checks to review & approve the changes on the Chromatic web site.

PRs that result in visual changes must be approved in Chromatic's UI before the PR can be committed to the `main` branch via GitHub. At the moment, everyone on the team has Chromatic review approval permissions, so you can approve your own PRs if you want to. In the future, we may move to a system where only a member of the UI/UX team can approve visual changes.

The full documentation for this review process is [available here](https://www.chromatic.com/docs/test). Note that the "UI Tests" and "UI Review" approvals are 2 separate workflows with multiple approvals required. (You can ignore the parts of the Chromatic documentation which explain how to set up the integration between GitHub and Chromatic, as that's already been done.)

### SVGs

Before using an SVG in any of the packages, run it through [SVGOMG](https://jakearchibald.github.io/svgomg/) first.

Other suggestions:

* Make sure the SVG has a square aspect ratio.
* Remove any `stroke` or `fill` colors; in React, we can use CSS to control these.

See https://www.youtube.com/watch?v=MbUyHQRq2go&list=PL7CcGwsqRpSM3w9BT_21tUU8JN2SnyckR&index=15 for an 8-minute tutorial.
