# primer-app

This repo contains the Primer frontend application and related packages.

## License

Unlike Primer's backend, this project is covered by a proprietary license; see [LICENSE.md](LICENSE.md). This project should not be distributed outside the company.

## Project organization

We use [Yarn 1.x](https://classic.yarnpkg.com/lang/en/) (also known as "classic Yarn") to manage JavaScript dependencies, build the project's packages, run tests, etc. We take advantage of [Yarn's support for workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), which means that this project is organized like a monorepo, in the sense that it contains multiple related packages, each managed via its own `package.json` & `yarn.lock` files.

The main reason for this project organization is so that Hackworth members and other contributors can develop UI components, using mainly HTML, CSS, and a bit of React, without needing to understand all the details of a complicated frontend web application. It also means that we can use tools and third-party integrations to develop and test these components without creating extraneous dependencies in our frontend application, so that our frontend application can remain relatively lightweight and move at the pace of React, rather than being held back by third-party dependencies that might lag behind the rest of the React ecosystem.

## Build system

All of the packages in this monorepo are managed by the [Vite build system](https://vitejs.dev/guide/). While this build system isn't as full-featured as [Create React App](https://create-react-app.dev), it's much simpler, more agile, and significantly faster than [Webpack](https://webpack.js.org), which underpins Create React App and is a major contributor to Create React App's complexity.

We build our official packages & run CI via Nix, of course. There are many Nix-based packagers for the JavaScript & Node.js ecosystem, none of which are perfect. We've chosen [yarn2nix](https://nixos.org/manual/nixpkgs/unstable/#language-javascript), which is probably the most mature & issue-free of the bunch. Additionally, it's officially supported (as in, it's included in nixpkgs, where it's annoyingly called [yarn2nix-moretea](https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/tools/yarn2nix-moretea/yarn2nix)), and it works with [the latest version of Node](https://nodejs.org/en/blog/release/v16.0.0/). The same cannot be said about any of the other Nix JavaScript package managers as of October 2021.

### `node_modules` & Nix

Another nice feature of `yarn2nix` is that it can automatically manage your project's local `node_modules` directory, so that what's in your project's local copy is identical to what `yarn2nix` uses to build & package your project in Nix.

Unfortunately, in our case, we can't currently make use of this feature, for two reasons:

1. Many JavaScript tools treat `node_modules` as a convenient cache location, but `yarn2nix` manages the local `node_modules` by symlinking it to the Nix store copy, which cannot (and should not) be written to. Sometimes these tools can be configured to write their caches elsewhere, and we've done that where possible, but there's no guarantee that we won't run into trouble in the future.

2. `yarn2nix` can only manage these symlinks for a flat Yarn project, not for multiple workspaces, as we're using.

These limitations mean that, for interactive development, we can't benefit from the Nix cache. Yarn will manage your local `node_modules` directories itself. The good news is that, practically speaking, there's little reason to be concerned that the package versions in your local `node_modules` directory will be out of sync with Nix's versions, because Yarn's `yarn.lock` file pins those dependencies, and `yarn2nix` uses that file to fetch the packages, just as Yarn does itself.

## Nix builds

The easiest way to build all Nix packages on your local machine is via:

```sh
nix-build -A ciJobs
```

This will build everything (production builds, tests, documentation, etc.) for all supported platforms.

To build the Nix derivation for just the frontend production distribution, run this on macOS:

```sh
nix-build -A packages.x86_64-darwin.hackworthltd-primer-app
```

or this on Linux:

```sh
nix-build -A packages.x86_64-linux.hackworthltd-primer-app
```

Likewise, to build the Nix derivation for just the Storybook distribution, run, e.g., on Linux:

```sh
nix-build -A packages.x86_64-linux.primer-components-storybook
```

Note that these commands should produce the same result regardless of which platform you build for (though perhaps not precisely, owing to minor platform differences), but they'll probably build faster if you choose the one that matches your local machine's operating system.

To run some basic, relatively quick project-wide checks (source code formatting, linting, etc.), run:

```sh
nix-build -A checks.x86_64-darwin
```

or

```sh
nix-build -A checks.x86_64-linux
```

Note that for some packages, these checks don't run the full test suite.

## Interactive development

To develop interactively, enter the Nix shell via `nix develop`. Once there, you can run all the usual `yarn` commands. Because we're using Yarn workspaces, if you're in the top-level project directory, most Yarn commands will need to be prefixed by `yarn workspace <package>`, where `<package>` is the name of the package you want to manage. Alternatively, from within the Nix shell, you can `cd` to the relevant package subdirectory and run Yarn from there, without the need for the `yarn workspace` command prefix. All packages in the workspace are subdirectories of the top-level `packages/` directory.

In particular, as a first time setup you will need to run `yarn` to populate the `node_modules` directories before `yarn dev`, `yarn lint` or `yarn build` will work. (However, some other commands, such as `yarn add` may automatically trigger this population.)

### Automatic, on-the-fly rebuilds

Via `wsrun`, we can run our build tool, Vite, in watch mode across multiple packages at once. Any change made to the source code of one of the watched packages will trigger a rebuild of that package, plus any of that package's reverse dependencies. Because this is handled via `wsrun` rather than Vite directly, this may result in temporarily broken builds (`wsrun` doesn't know how to make the watcher for the reverse dependency wait for the dependency's build to finish, so the reverse dependency may temporarily see missing or incomplete object files in the dependency's output directory), but Vite's watch mode is pretty robust, and eventually things should just work again without your needing to intervene or restart the watchers.

To hack on the main Primer application in this mode, run this command from the top-level directory:

```sh
yarn watch
```

To hack on the `@hackworthltd/primer-components` Storybook in this mode, run this command from the top-level directory:

```sh
yarn watch:storybook
```

Note, however, that the Storybook watch mode does not appear to reliably catch all TypeScript errors, so consider this mode to be beta- or alpha-quality.

### Fast project-wide builds

When you want to build every package in the whole workspace very quickly, you can use `ultra`, like so:

```sh
ultra -r build
```

You can also use `yarn workspaces run build`, but `ultra` does some extra bookkeeping to decide whether a build is needed (i.e., have files been modified since the last build), whereas `yarn` just blindly performs the builds whether they're necessary or not.

Note that `ultra` has a recursive watch mode, but it's not yet robust enough to work like `wsrun` does, so `ultra` is currently only useful for one-off whole-workspace builds.

### Project-wide builds using `tsc`

The TypeScript compiler has a whole-project build/watch mode that can be invoked as follows:

```sh
tsc --build --watch
```

However, the configuration required to make `tsc` work like this is currently not compatible with how we use Vite and Nix. Therefore, this command will fail on our project. See https://github.com/hackworthltd/primer-app/pull/155

### The top-level package

Only project-wide commands should be installed & run at top-level.

Occasionally, it makes sense to install a Yarn development dependency in the top-level package (e.g., [`prettier`](https://prettier.io)), but for the most part, you should only install dependencies on a per-package basis. For example, if you want to add a dev dependency for package `foo` to the `@hackworthltd/primer-app` package, you would run:

```sh
yarn workspace @hackworthltd/primer-app add --dev foo
```

or, alternatively:

```sh
cd packages/primer-app
yarn add --dev foo
```

#### `yarn format`

This runs `prettier --write` on all packages in the workspace, using project-wide `prettier` settings.

### The `@hackworthltd/primer-app` package

This package is where the actual frontend application lives. Its Yarn/Node name is `@hackworthltd/primer-app`, but it lives in the `packages/primer-app` subdirectory of the repo.

The following commands are useful in this workspace.

#### `yarn dev`

Alternatively, from the top-level directory: 

```sh
yarn workspace @hackworthltd/primer-app dev
```

You may need to do a `yarn build` for `primer-components` before this will work.

This command runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) in a browser to interact with it.
You can do `yarn dev --open` to automatically open a browser window.

Thanks to Vite's [hot module reloading feature (HMR)](https://vitejs.dev/guide/features.html#hot-module-replacement), the page will reload automatically whenever you make an edit to any source code or CSS files. (Changing a package's settings in a `.json` or `.js` file may require that you restart the dev server, as these changes are often not automatically picked up.)

In development mode, Vite also runs TypeScript and `eslint` when files change, so you'll see warnings and errors in the console where the `yarn dev` command is running. There is sometimes a lag between when the browser reloads and the errors & warnings show up, however.

#### `yarn lint` and `yarn lint:fix`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-app lint
```

These commands run `eslint` on the `primer-app` code base. The `lint:fix` variant will automatically apply to the source files any fixes that `eslint` offers.

#### `yarn build`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-app build
```

This command builds the app for production, and places the optimized files in the `dist` subdirectory of the package directory. 

Once you've built the production version locally, you can then run `yarn serve` and open [http://localhost:5000](http://localhost:5000) in a browser to see the production build. (Note: `yarn serve` does not appear to be compatible with Safari on macOS. You may need to use Firefox or Chrome to view the production build on this platform.) 

In theory, the local production version of the application should be no different than the `dev` version, so unless you're trying to debug a production issue locally, `yarn serve` is probably not what you want.

### The `@hackworthltd/primer-components` package

This package is a component library for the frontend application. It is used as a dependency by the `@hackworthltd/primer-app` package, so it is built as a library, rather than a standalone application. It also includes a [Storybook.js](https://storybook.js.org) application for rapid component-based development and visual testing.

This package's Yarn/Node name is `@hackworthltd/primer-components`, but it lives in the `packages/primer-components` subdirectory of the repo.

The following commands are useful in this workspace.

#### `yarn build`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-components build
```

This command builds a production-ready distribution of the library. This will output not only the minified JavaScript for the component library, but also any TypeScript type definitions (`.d.ts` files) for types that the library exports.

In general, this is probably not a very useful interactive command.

#### `yarn storybook`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-components storybook
```

This command builds the component Storybook and then serves a local instance of it, which includes support for HMR.  It will automatically open a browser window.  This can be disabled by `yarn storybook --no-open`.

#### `yarn build-storybook`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-components build-storybook
```

This is the deployment-ready version of the component Storybook, the same as the one we deploy to Chromatic for CI builds (see below). You probably won't need to run this command very often.

#### `yarn lint` and `yarn lint:fix`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-components lint
```

This command runs linting on the component library, and the `lint:fix` variant applies automatic fixes.

#### `yarn chromatic`

Alternatively, from the top-level directory:

```sh
yarn workspace @hackworthltd/primer-components chromatic
```

This command performs a manual Chromatic deployment. You should never need to do this.

## Other notes

### Calculating reverse dependencies

To find out we have a dependency on a particular package, run `yarn why <package-name>`. For example:

```sh
yarn why immer                                                                                                                         ~/git/primer-app
yarn why v1.22.17
[1/4] 🤔  Why do we have the module "immer"...?
[2/4] 🚚  Initialising dependency graph...
[3/4] 🔍  Finding dependency...
[4/4] 🚡  Calculating file sizes...
=> Found "immer@8.0.1"
info Reasons this module exists
   - "_project_#@hackworthltd#primer-components#@storybook#react#react-dev-utils" depends on it
   - Hoisted from "_project_#@hackworthltd#primer-components#@storybook#react#react-dev-utils#immer"
info Disk size without dependencies: "1.02MB"
info Disk size with unique dependencies: "1.02MB"
info Disk size with transitive dependencies: "1.02MB"
info Number of shared dependencies: 0
✨  Done in 0.31s.
```

### Upgrading npm packages

To upgrade the `npm` package set for the entire project, including all workspace packages' dependencies, run the following command from the top-level project directory:

```sh
yarn upgrade
```

There's no need to run this command in each separate workspace unless you want to upgrade only that workspace/package's dependencies.

The `yarn upgrade` command will strictly obey any version bounds specified in packages's `package.json` file. To ignore those bounds and upgrade all packages to their latest versions, run this command from the each project directory:

```sh
yarn upgrade-interactive --latest
```

This command will also update the various `package.json` files' version bounds, as needed.

### Type-checking in TypeScript

The TypeScript compiler (`tsc`) can perform full type-checking on your TypeScript code, and there are some knobs to set in the per-package `tsconfig.json` file depending on how strict you want it to be. However, most TypeScript projects, including ours, do not use `tsc` to generate object code, both because `tsc` is relatively slow, and because it doesn't produce particularly efficient object code (neither in terms of size nor performance). Most projects use `tsc` only as a sort of opt-in type-checking pass, and it's often combined with other tooling (e.g., `eslint`).

If you're coming from the Haskell or PureScript world, this approach takes some getting used to. For one thing, if you want to enforce type-checking, you must explicitly enable `tsc` passes, either directly by calling `tsc` in the Yarn build command, or indirectly by adding some configuration to the build system's own configuration. Unfortunately, this configuration is often quite bespoke, and there are a seemingly infinite number of ways (and plugins) to do this.

In our project, we enforce `tsc` and `eslint` passes in production build rules (i.e., usually on `yarn build` commands), and we try to run them in parallel with/after the object code pass for interactive development. This means that if you make a change during interactive development that compiles without errors in JavaScript but is ill-typed, error messages from the type-checking pass will sometimes show up a few seconds after your browser reloads.

Therefore, you need to be diligent during interactive development to check for type errors, either in the terminal window where you're running the interactive build command, or in your editor, if you've enabled LSP support.

On the other hand, for production builds and CI, you can rest assured that TypeScript will catch type errors, modulo bugs in our build system configuration.

### LSP support and other tooling

We've tried to configure the project such that LSP and other tooling should "just work" in your editor, but you still might need to do some configuration on your end to hook it up. At the very least, the Nix development shell provides binaries for the TypeScript language server and `eslint` support, so you shouldn't need to download these or otherwise install them in your environment. (However, note to Emacs LSP users: it may prompt you whether it should automatically download a helper, and in my experience, this is usually necessary. I haven't gotten to the bottom of why this is required. -- @dhess)

Probably the easiest way to ensure your editor sees the right environment is to add [`direnv`](https://direnv.net) support to your shell & editor, and then use [`nix-direnv`](https://github.com/nix-community/nix-direnv) to ensure that your editor sees the tools that the Nix shell provides. If you've got `nix-direnv` in your environment, you can do this by adding a file to the top-level project directory named `.envrc`, which contains just this one line:

```
use flake
```

If you need a tool that's not provided by the project's Nix development shell and you think others would benefit from it, as well, please make a PR!

### Common project settings

It's not uncommon in Yarn workspace projects to need slightly different tooling settings for each individual workspace, but this isn't always the case. In theory, at least for some tools, it's possible to use a base configuration by default, and then add/override just the settings that are different for individual workspaces.

We tried this initially by creating a separate "settings-only" package and adding it as a dependency to the other packages in the workspace, but we ran into several path resolution problems, and it didn't seem worth the trouble. Unfortunately, this means that there is a lot of duplication of tool settings across multiple packages, which will require discipline to keep them in sync when we want to, e.g., add some new typechecking rules across the board.

### CI & Chromatic

We use [Chromatic](https://www.chromatic.com), a commercial service that works with Storybook.js to provide per-component, per-commit visual testing and review. Chromatic is automatically run on every pull request on the [primer-app repo](https://github.com/hackworthltd/primer-app). If a PR causes a visible change to the component library (i.e., the Storybook built by the `packages.x86_64-linux.primer-components-storybook` Nix derivation), Chromatic will indicate in that PR's checks/statuses section that an approval is necessary before the PR can be committed. You can click on the "details" link for the "UI Tests" and "UI Review" checks to review & approve the changes on the Chromatic web site.

PRs that result in visual changes must be approved in Chromatic's UI before the PR can be committed to the `main` branch via GitHub. At the moment, everyone on the team has Chromatic review approval permissions, so you can approve your own PRs if you want to. In the future, we may move to a system where only a member of the UI/UX team can approve visual changes.

The full documentation for this review process is [available here](https://www.chromatic.com/docs/test). Note that the "UI Tests" and "UI Review" approvals are 2 separate workflows with multiple approvals required. (You can ignore the parts of the Chromatic documentation which explain how to set up the integration between GitHub and Chromatic, as that's already been done.)

### SVGs

Before using an SVG in any of the packages, run it through [SVGOMG](https://jakearchibald.github.io/svgomg/) first.

Other suggestions:

* Make sure the SVG has a square aspect ratio.
* Remove any `stroke` or `fill` colors; in React, we can use CSS to control these.

See https://www.youtube.com/watch?v=MbUyHQRq2go&list=PL7CcGwsqRpSM3w9BT_21tUU8JN2SnyckR&index=15 for an 8-minute tutorial.

We use the [`@honkhonk/vite-plugin-svgr`](https://github.com/lucsky/vite-plugin-svgr) Vite plugin to automatically convert SVGs to React components. See [here](https://github.com/hackworthltd/primer-app/blob/333378833184c039f40912ed5b38272a332be0e8/packages/primer-components/src/BinaryTreePlaceholder/BinaryTreePlaceholder.tsx#L3) for an example of how to use this feature.
