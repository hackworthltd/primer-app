# primer-app

This repo contains the Primer React frontend application and related projects.

## License

Unlike Primer's backend, this project is covered by a proprietary license; see [LICENSE.md](LICENSE.md). This project should not be distributed outside the company.

## Project organization

We use [Yarn 1.x](https://classic.yarnpkg.com/lang/en/) (also known as "classic Yarn") to manage JavaScript dependencies, build the project, run tests, etc. We take advantage of [Yarn's support for workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), which means that this project is organized like a monorepo, in the sense that it contains (or will soon contain) multiple related projects, each managed via its own `package.json` & `yarn.lock` files.

The main reason for this project organization is so that Hackworth members and other contributors can develop UI components, using mainly HTML, CSS, and a bit of React, without needing to understand all the details of a complicated frontend web application. It also means that we can use tools and third-party integrations to develop and test these components without creating extraneous dependencies in our frontend application, so that our frontend application can remain relatively lightweight and move at the pace of React, rather than being held back by third-party dependencies that might lag behind the rest of the React ecosystem.

## Build system

All of the projects in this monorepo are managed by the [Vite build system](https://vitejs.dev/guide/). While this build system isn't as full-featured as [Create React App](https://create-react-app.dev), it's much simpler, more agile, and significantly faster than [Webpack](https://webpack.js.org), which underpins Create React App and is a major contributor to Create React App's complexity.

We build our official packages & run CI via Nix, of course. There are many Nix-based packagers for the JavaScript & Node.js ecosystem, none of which are perfect. We've chosen [yarn2nix](https://nixos.org/manual/nixpkgs/unstable/#language-javascript), which is probably the most mature & issue-free of the bunch. Additionally, it's officially supported (as in, it's included in nixpkgs, where it's annoyingly called [yarn2nix-moretea](https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/tools/yarn2nix-moretea/yarn2nix)), and it works with [the latest version of Node](https://nodejs.org/en/blog/release/v16.0.0/). The same cannot be said about any of the other Nix JavaScript package managers as of September 2021.

### `node_modules` & Nix

Another nice feature of `yarn2nix` is that it can automatically manage your project's local `node_modules` directory, so that what's in your project's local copy is identical to what `yarn2nix` uses to build & package your project in Nix.

Unfortunately, in our case, we can't currently make use of this feature, for two reasons:

1. Many JavaScript tools treat `node_modules` as a convenient cache location, but `yarn2nix` manages the local `node_modules` by symlinking it to the Nix store copy, which cannot (and should not) be written to. Sometimes these tools can be configured to write their caches elsewhere, and we've done that where possible, but there's no guarantee that we won't run into trouble in the future.

2. `yarn2nix` can only manage these symlinks for a flat Yarn project, not for multiple workspaces, as we're using.

These limitations mean that, for interactive development, we can't benefit from the Nix cache. Yarn will manage your local `node_modules` directories itself. The good news is that, practically speaking, there's little reason to be concerned that the package versions in your local `node_modules` directory will be out of sync with Nix's versions, because Yarn's `yarn.lock` file pins those dependencies, and `yarn2nix` uses that file to fetch the packages, just as Yarn does itself.

## Nix builds

The easiest way to build all Nix packages on your local machine is via `nix-build -A ciJobs`. This will build everything (production builds, tests, documentation, etc.) for all supported platforms.

To build the just frontend production distribution, run `nix-build -A packages.x86_64-darwin.primer-app` on macOS, and `nix-build -A packages.x86_64-linux.primer-app` on Linux. (These commands should produce the same result regardless of which platform you build for, but they'll probably build faster if you choose the one that matches your local machine's operating system.)

To run some basic, relatively quick project-wide checks (source code formatting, linting, etc.), run `nix-build -A checks.x86_64-darwin` on macOS, and `nix-build -A checks.x86_64-linux` on Linux. Note that for some projects, these checks don't run the full test suite.

## Interactive development

To develop interactively, enter the Nix shell via `nix develop`. Once there, you can run all the usual `yarn` commands. Because we're using Yarn workspaces, if you're in the top-level project directory, most Yarn commands will need to be prefixed by `yarn workspace <package>`, where `<package>` is the name of the package you want to manage. Alternatively, from within the Nix shell, you can `cd` to the relevant project subdirectory and run Yarn from there, without the need for the `yarn workspace` command prefix. All packages in the workspace are subdirectories of the top-level `packages/` directory.

Occasionally, it makes sense to install a Yarn development dependency in the top-level project (e.g., [`prettier`](https://prettier.io)), but for the most part, you should only install dependencies on a per-package basis.

At the top level, only the `yarn format` command is particularly interesting. It runs `prettier --write` on all projects in the workspace.

### The `primer-app` project

This project is where the actual frontend application lives. The following commands are useful here:

### `yarn dev`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) in a browser to interact with it.

The page will reload automatically whenever you make an edit to any source code or CSS files. Changing project settings in a `.json` or `.js` file may require that you restart the dev server, as these changes are often not automatically picked up.

In development mode, Vite also runs TypeScript and `eslint` when files change, so you'll see warnings and errors in the console where the `yarn dev` command is running.

### `yarn lint` and `yarn lint:fix`

These commands run `eslint` on the `primer-app` code base. The `lint:fix` variant will automatically apply to the source files any fixes that `eslint` offers.

### `yarn build`

This command builds the app for production, and places the optimized files in the `dist` subdirectory of the project. 

Once you've built the production version locally, you can then run `yarn serve` and open [http://localhost:5000](http://localhost:5000) in a browser to see the production build. (Note: `yarn serve` does not appear to be compatible with Safari on macOS. You may need to use Firefox or Chrome to view the production build on this platform.) In theory, the local production version of the application should be no different than the `dev` version, so unless you're trying to debug a production issue locally, `yarn serve` is probably not what you want.

## Other notes

### SVGs

Before using an SVG in any of the projects, run it through [SVGOMG](https://jakearchibald.github.io/svgomg/) first.

Other suggestions:

* Make sure the SVG has a square aspect ratio.
* Remove any `stroke` or `fill` colors; in React, we can use CSS to control these.

See https://www.youtube.com/watch?v=MbUyHQRq2go&list=PL7CcGwsqRpSM3w9BT_21tUU8JN2SnyckR&index=15 for an 8-minute tutorial.

