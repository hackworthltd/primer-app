# primer-app

This repo contains the Primer frontend application and related packages.

## License

Unlike Primer's backend, this project is covered by a proprietary license; see [LICENSE.md](LICENSE.md). This project should not be distributed outside the company.

## Project organization

For this project, we use a monorepo containing multiple projects: `@hackworthltd/primer-types`, `@hackworthltd/primer-components`, and `@hackworthltd/primer-app`.

The main reason for this project organization is so that Hackworth members and other contributors can develop UI components, using mainly HTML, CSS, and a bit of React, without needing to understand all the details of a complicated frontend web application. It also means that we can use tools and third-party integrations to develop and test these components without creating extraneous dependencies in our frontend application, so that our frontend application can remain relatively lightweight and move at the pace of React, rather than being held back by third-party dependencies that might lag behind the rest of the React ecosystem.

## Build system

All of the packages in this monorepo are built with the [Vite build system](https://vitejs.dev/guide/). While this build system isn't as full-featured as [Create React App](https://create-react-app.dev), it's much simpler, more agile, and significantly faster than [Webpack](https://webpack.js.org), which underpins Create React App and is a major contributor to Create React App's complexity.

We use [`pnpm`](https://pnpm.io/) to manage packages and run commands.

Note that, in this project, we do *not* use Nix in any significant capacity. Nix is used only to install some tooling in the `nix develop` shell, and to run some linting hooks in CI. (We used to use Nix with `yarn2nix`, but we found that it created more problems than it was worth. As of May 2022, the JavaScript ecosystem is not well supported in Nix.)

## Interactive development

To develop interactively, enter the Nix shell via `nix develop`. Once there, you can run all the usual `pnpm` commands.

In particular, as a first time setup you will need to run `pnpm install` to populate the `node_modules` directories before other commands will work. Once the local packages are installed, you can run commands such as `pnpm build` and `pnpm watch`.

### The top-level package

Note: only project-wide development dependencies such as TypeScript should be installed in the top-level package.

There are a few commands that work in the top-level package.

#### `pnpm build`

This command builds all the packages in the workspace sequentially, in dependency order.

#### `pnpm format`

This runs `prettier --write` on all packages in the workspace, using project-wide `prettier` settings.

#### `pnpm lint` and `pnpm lint:fix`

Runs `eslint` on all source files in the workspace. The `lint:fix` variant will also attempt to fix any linting issues.

### The `@hackworthltd/primer-app` package

This package contains the actual frontend application. It lives in the `packages/primer-app` subdirectory of the repo.

The following commands are useful in this workspace.

#### `pnpm build`

This command builds a production version of the frontend application only, and not its dependencies. You'll normally want to run this command at top level, to ensure that the frontend application bundle includes up-to-date dependencies on the other packages in the monorepo.

Once you've built the production version, you can then run `pnpm serve` and open [http://localhost:5000](http://localhost:5000) in a browser to see the production build. (Note: `pnpm serve` does not appear to be compatible with Safari on macOS. You may need to use Firefox or Chrome to view the production build on this platform.) 

In theory, the local production version of the application should be no different than the `watch` HMR version, so unless you're trying to debug a production issue locally, `pnpm serve` is probably not what you want.

#### `pnpm watch`

Note: you may need to do a `pnpm build` on the `@hackworthltd/primer-components` and `@hackworthltd/primer-types` packages before this will work.

This command runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) in a browser to interact with it. You can run `pnpm watch --open` to automatically open a browser window.

Thanks to Vite's [hot module reloading feature (HMR)](https://vitejs.dev/guide/features.html#hot-module-replacement), the page will reload automatically whenever you make an edit to any source code or CSS files. (Changing a package's settings in a `.json` or `.js` file may require that you restart the dev server, as these changes are often not automatically picked up.)

In development mode, Vite also runs TypeScript and `eslint` when files change, so you'll see warnings and errors in the console where the `pnpm watch` command is running. There is sometimes a lag between when the browser reloads and the errors & warnings show up, however.

Note that if you make changes to one of the app's dependencies (i.e., one of the other packages in the monorepo), this will not be automatically picked up by `pnpm watch` running in the `@hackworthltd/primer-app` package. You'll need to rebuild that package separately, at which point the `pnpm watch` command on `@hackworthltd/primer-app` *will* see the changes. We used to have a command that could run a `watch` on all of the projects at once, but that only worked with Yarn, so its functionality is now lost. You can (clumsily) replicate this by opening 3 shells, one for each project in the repo, and running `pnpm watch` in each, simultaneously.

#### `pnpm generate`

This command automatically generates Primer API bindings for the frontend application. You need only run this whenever you update the `primer-api.json` file, which is generated by our `primer` backend repo. See below for more details.

#### `pnpm lint` and `pnpm lint:fix`

As the top-level equivalents.

### The `@hackworthltd/primer-components` package

This package's name is `@hackworthltd/primer-components`, but it lives in the `packages/primer-components` subdirectory of the repo.

This package is a component library for the frontend application. It is used as a dependency by the `@hackworthltd/primer-app` package, so it is built as a library, rather than a standalone application. It also includes a [Storybook.js](https://storybook.js.org) application for rapid component-based development and visual testing.

The following commands are useful in this workspace.

#### `pnpm build`

This command builds a production-ready distribution of the library. This will output not only the minified JavaScript for the component library, but also any TypeScript type definitions (`.d.ts` files) for types that the library exports.

In general, this is probably not a very useful interactive command.

#### `pnpm watch`

Note: you may need to do a `pnpm build` on the `@hackworthltd/primer-types` package before this will work.

This command builds the package in development mode. It's only something you'll need to run when you're running the frontend application in `pnpm watch` mode, as well. See the instructions for that package for details.

#### `pnpm storybook`

This command builds the component Storybook and then serves a local instance of it, which includes support for HMR.  It will automatically open a browser window.  This can be disabled by `pnpm storybook --no-open`.

Note that you'll need to run the corresponding command in the `@hackworthltd/primer-types` package in order for the Storybook to pick up any changes you make to the types in that package. We may add a command in the future which does all of this automatically.

#### `pnpm build-storybook`

This is the deployment-ready version of the component Storybook, the same as the one we deploy to Chromatic for CI builds (see below). You probably won't need to run this command very often.

#### `pnpm lint` and `pnpm lint:fix`

As the top-level equivalents.

#### `pnpm chromatic`

This command performs a manual Chromatic deployment. You should never need to do this (and it probably won't work, anyway, as you likely don't have the necessary credentials to deploy to Chromatic).

### The `@hackworthltd/primer-types` package

This package's name is `@hackworthltd/primer-types`, but it lives in the `packages/primer-types` subdirectory of the repo.

This package contains some low-level types that are compatible with corresponding types in the Primer API. It is used as a dependency by both the `@hackworthltd/primer-app` and `@hackworthltd/primer-components` packages, so it is built as a library, rather than a standalone application.

It's possible this package will eventually go away and be replaced entirely with code that's automatically generated by `orval` from the Primer API OpenAPI spec, but while we're bootstrapping, it's useful as a standalone package.

The following commands are useful in this workspace.

#### `pnpm build`

This command builds a production-ready distribution of the library. This will output not only the minified JavaScript for the component library, but also any TypeScript type definitions (`.d.ts` files) for types that the library exports.

In general, this is probably not a very useful interactive command.

#### `pnpm watch`

This command builds the package in development mode. It's only something you'll need to run when you're running the frontend application in `pnpm watch` mode, or when running the project's Storybook in HMR mode. See the corresponding instructions elsewhere in this README for details.

#### `pnpm storybook`

This is a convenient alias for the `pnpm watch` command.

#### `pnpm lint` and `pnpm lint:fix`

As the top-level equivalents.

### Running package scripts & commands

You can use `pnpm` to run scripts and commands that are installed by the various packages in the repo. For example, to use `tsc`, the TypeScript compiler, you can run `pnpm tsc`.

## Other notes

### Updating the backend API & bindings

We use [Orval](https://github.com/anymaniax/orval) to automatically generate TypeScript bindings for the Primer backend API. Updating these bindings requires a manual step in the Primer repo, after which you must copy the resulting `openapi.json` file to this repo as `primer-api.json`. We'll automate this in the future, but for now, do the following:

* In the Primer repo, run the following:

```sh
nix develop
make openapi.json
cp openapi.json <path/to/primer-app-repo>/packages/primer-app/primer-api.json
```

* Then, in this repo, run the following:

```sh
nix develop
cd packages/primer-app && pnpm generate
```

(Note that Orval will update the generated bindings even if there's only been an Orval version bump and no functional changes, which is annoying.)

### Calculating reverse dependencies

To find out why one of our packages has a dependency on a particular package, run `pnpm why <package-name>` in that package's subdirectory. For example:

```sh
~/git/primer-app/packages/primer-app  pnpm why react                                                Legend: production dependency, optional only, dev only

@hackworthltd/primer-app@0.2.0 /Users/dhess/git/primer-app/packages/primer-app

dependencies:
react 17.0.2
react-dom 17.0.2
└── react 17.0.2 peer
react-query 3.39.0
├── react 17.0.2 peer
└─┬ react-dom 17.0.2 peer
  └── react 17.0.2 peer
react-router-dom 6.3.0
├── react 17.0.2 peer
├─┬ react-dom 17.0.2 peer
│ └── react 17.0.2 peer
└─┬ react-router 6.3.0
  └── react 17.0.2 peer
```

### Upgrading dependencies

To upgrade the package set for the entire project, including all workspace packages' dependencies, run the following command from the top-level project directory:

```sh
pnpm -r upgrade
```

The `pnpm upgrade` command will strictly obey any version bounds specified in packages's `package.json` file. To ignore those bounds and upgrade all packages to their latest versions, run `pnpm -r upgrade --latest`.

This command will also update the various `package.json` files' version bounds, as needed.

### Type-checking in TypeScript

The TypeScript compiler (`tsc`) can perform full type-checking on your TypeScript code, and there are some knobs to set in the per-package `tsconfig.json` file depending on how strict you want it to be. However, most TypeScript projects, including ours, do not use `tsc` to generate object code, both because `tsc` is relatively slow, and because it doesn't produce particularly efficient object code (neither in terms of size nor performance). Most projects use `tsc` only as a sort of opt-in type-checking pass, and it's often combined with other tooling (e.g., `eslint`).

If you're coming from the Haskell or PureScript world, this approach takes some getting used to. For one thing, if you want to enforce type-checking, you must explicitly enable `tsc` passes, either directly by calling `tsc` in the project's build command, or indirectly by adding some configuration to the build system's own configuration. Unfortunately, this configuration is often quite bespoke, and there are a seemingly infinite number of ways (and plugins) to do this.

In our project, we enforce `tsc` and `eslint` passes in production build rules (i.e., usually on `pnpm build` commands), and we try to run them in parallel with/after the object code pass for interactive development. This means that if you make a change during interactive development that compiles without errors in JavaScript but is ill-typed, error messages from the type-checking pass will sometimes show up a few seconds after your browser reloads.

Therefore, you need to be diligent during interactive development to check for type errors, either in the terminal window where you're running the interactive build command, or in your editor, if you've enabled LSP support.

On the other hand, for production builds and CI, you can rest assured that TypeScript will catch type errors, modulo bugs in our build system configuration.

### LSP support and other tooling

We've tried to configure the project such that LSP and other tooling should "just work" in your editor, but you still might need to do some configuration on your end to hook it up. At the very least, the Nix development shell provides binaries for the TypeScript language server and `eslint` support, so you shouldn't need to download these or otherwise install them in your environment. (However, note to Emacs LSP users: it may prompt you whether it should automatically download a helper, and in my experience, this is usually necessary. I haven't gotten to the bottom of why this is required. -- @dhess)

Probably the easiest way to ensure your editor sees the right environment is to add [`direnv`](https://direnv.net) support to your shell & editor, and then use [`nix-direnv`](https://github.com/nix-community/nix-direnv) to ensure that your editor sees the tools that the Nix shell provides. If you've got `nix-direnv` in your environment, you can do this by adding a file to the top-level project directory named `.envrc`, which contains just this one line:

```
use flake
```

If you need a tool that's not provided by the project's Nix development shell and you think others would benefit from it, as well, please make a PR!

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
