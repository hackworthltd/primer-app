# primer-app

This repo contains the Primer frontend application and related packages.

## License

Unlike Primer's backend, this project is covered by a proprietary license; see [LICENSE.md](LICENSE.md). This project should not be distributed outside the company.

## This repo's relationship to the Primer repo

Because the Primer backend project is open source, and this project is not, the 2 projects must live in separate repositories. In order to keep the frontend code in sync with a particular version of the Primer backend/API, we pin the Primer backend repo to a particular git commit/rev via a Nix flake input pin. This ensures that when we run a local `primer-service` instance during development ([see below](#Running-a-local-`primer-service`-instance)), we're running the correct version of the backend for the current frontend, and we don't need to worry about keeping our local copies of these 2 repos in sync. The drawback to this approach is that if we need to make backend changes to accommodate a new frontend feature, we must first commit those changes to the backend repo's `main` branch before we can update the local Nix flake pin. (However, we can always fall back to running the local `primer-service` from a local copy of the backend repo, if necessary.)

To bump the Primer pin, update the Primer git rev in `nix.flake`, and then run the following commands:

```sh
nix flake update
nix develop
```

(The `nix develop` step ensures that this project's API bindings are up to date with Primer's.)

## Build system

We use the [Vite build system](https://vitejs.dev/guide/). While this build system isn't as full-featured as [Create React App](https://create-react-app.dev), it's much simpler, more agile, and significantly faster than [Webpack](https://webpack.js.org), which underpins Create React App and is a major contributor to Create React App's complexity.

We use [`pnpm`](https://pnpm.io/) to manage packages and run commands.

Note that, in this project, we do *not* use Nix in any significant capacity. Nix is used only to install some tooling in the `nix develop` shell, and to run some linting hooks in CI. (We used to use Nix with `yarn2nix`, but we found that it created more problems than it was worth. As of May 2022, the JavaScript ecosystem is not well supported in Nix.)

## Interactive development

To develop interactively, enter the Nix shell via `nix develop`. Note that we do not use Nix to install `pnpm`, as we've had issues with Nix and Node.js integration in the past, so the first time you check out the `primer-app` repo, you'll need to run `npx pnpm install` to bootstrap a new repo. 

After the initial bootstrap, you'll be able to run just `nix develop` and then all the standard `pnpm` command should work.

### Running a local `primer-service` instance

In most circumstances, while developing locally, you'll want to launch the version of `primer-service` that is pinned via this repo's `primer` Nix flake input. To do that, run the following command from this project's top-level directory:

```sh
nix run .#run-primer
```

Note that this only works if there's also a local PostgreSQL Docker instance running. Because we expect that developers will generally always be running this PostgreSQL instance, we haven't bothered to include the related Docker helper scripts from the Primer repo in this repo. See the [Primer repo's README file](https://github.com/hackworthltd/primer/blob/main/README.md#local-development) for details on how to manage the PostgreSQL Docker instance.

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

Once you've built the production version, you can then run `pnpm serve` and open [http://localhost:5000](http://localhost:5000) in a browser to see the production build. (Note: `pnpm serve` does not appear to be compatible with Safari on macOS. You may need to use Firefox or Chrome to view the production build on this platform.) 

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

## Deployments

### Backend

We deploy the Primer service into production via this repo. Our current deployment platform is [Fly.io](https://fly.io). Fly.io support multiple deployment regions, but for the moment, we're only deploying to LHR (London). For database performance reasons, once we host a significant number of non-UK schools, we'll need to consider deploying to other regions.

The initial creation of a new Fly.io app is [relatively simple](https://fly.io/docs/getting-started/launch-app/), especially in our case, as we already build a Docker image for Primer using Nix, and can simply point `flyctl deploy` to an existing Docker image. Creating a new PostgreSQL database on Fly.io is [slightly more complicated](https://fly.io/docs/reference/postgres/), but still relatively easy. As these topics are specific to Fly.io, have nothing to do with Primer per se, and are covered in the Fly.io documentation, we will not replicate those instructions here.

Once an instance of the Primer service is deployed into a particular region, subsequent deployments are very straightforward. There is a `deploy-primer-service` script in this repo that handles the details. Note that you should never need to run this script by hand: it is run after every merge to the `main` branch of this repo via an automated GitHub Deployment and Buildkite process.

There are two wrinkles:

1. A brand new database doesn't contain any programs. This is relatively easy to fix, as we can use `primer-client` to seed a few example programs. (We currently must do this by hand, however.)

2. We occasionally require database migrations. These have been incorporated into the deployment script so that a database is migrated before the new version of `primer-service` is deployed (assuming the migrated database is backwards compatible, but that is out of scope for this document). However, this requires a) that a suitable `DATABASE_URL` is available to the deployment script for the Fly.io PostgreSQL instance to be migrated; and b) that the deployment script can connect to the PostgreSQL instance. Normally neither of these is available outside of Fly.io's execution environment, but our deployment script and Vault server can make the required secrets available to the deployment script at deployment time.

For security reasons, we run the database migrations as a PostgreSQL user created for this specific purpose. (However, note that at the time of writing, it's not clear whether [sqitch](https://sqitch.org/docs/manual/sqitchtutorial/), our schema management tool, works with any privileges less than `SUPERUSER`, so that is what we use for now.) Fly.io does not create this PostgreSQL user automatically for us like it does for Fly.io apps, so whenever we create a new database from scratch, we need to run the following steps manually (assuming a Fly.io personal access token is available) from the top-level directory of this repo:

```
 flyctl postgres connect -a hackworth-code-postgres
WARN app flag 'hackworth-code-postgres' does not match app name in config file 'hackworth-code'
? Continue using 'hackworth-code-postgres' Yes
Connecting to hackworth-code-postgres.internal... complete
psql (14.4 (Debian 14.4-1.pgdg110+1))
Type "help" for help.

postgres=# CREATE ROLE deploydb WITH LOGIN SUPERUSER PASSWORD 'xxx';
CREATE ROLE
postgres=# ^D
\q

```

Note that these steps only need to be run after the initial database creation (i.e., after `flyctl postgres create`), and never again.

Then store a `DATABASE_URL` for the newly-created `deploydb` user in our Vault service. Its value should be `postgres://deploydb:xxx@localhost:5432/hackworth_code` where `xxx` is the password value you used in the previous step. This secret should be stored at a Vault path where the Buildkite agent that runs our Fly.io deployments can read it. (The Vault config for this step is out of scope for this document, and should be implemented in our `hackworth-nix` and `hackworth-ops` repo.)

Note that the `DATABASE_URL` we store in Vault uses `localhost` as the PostgreSQL server address, because our deployment script runs database migrations against the proxy created by the `flyctl proxy` command. See [this link](https://fly.io/docs/reference/postgres/#on-a-machine-with-flyctl-installed) for details of how the proxy works.

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
