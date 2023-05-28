# Miscellaneous notes

## Calculating reverse dependencies

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

## Upgrading dependencies

To upgrade the package set for the project, run the following command:

```sh
pnpm upgrade
```

The `pnpm upgrade` command will strictly obey any version bounds specified in the project's `package.json` file. To ignore those bounds and upgrade all packages to their latest versions, run `pnpm upgrade --latest`.

This command will also update the `package.json` file's version bounds, as needed.

To upgrade the package set to the latest versions of packages, irrespective of any version bounds in `package.json`, run:

```sh
pnpm upgrade --latest --interactive
```

We use the `--interactive` flag to allow a manual review of the upgrades that'll be performed in this mode, rather than blindly upgrading everything.

## Type-checking in TypeScript

The TypeScript compiler (`tsc`) can perform full type-checking on your TypeScript code, and there are some knobs to set in the per-package `tsconfig.json` file depending on how strict you want it to be. However, most TypeScript projects, including ours, do not use `tsc` to generate object code, both because `tsc` is relatively slow, and because it doesn't produce particularly efficient object code (neither in terms of size nor performance). Most projects use `tsc` only as a sort of opt-in type-checking pass, and it's often combined with other tooling (e.g., `eslint`).

If you're coming from the Haskell world, this approach takes some getting used to. For one thing, if you want to enforce type-checking, you must explicitly enable `tsc` passes, either directly by calling `tsc` in the project's build command, or indirectly by adding some configuration to the build system's own configuration. Unfortunately, this configuration is often quite bespoke, and there are a seemingly infinite number of ways (and plugins) to do this.

In our project, we enforce `tsc` and `eslint` passes in production build rules (i.e., usually on `pnpm build` commands), and we try to run them in parallel with/after the object code pass for interactive development. This means that if you make a change during interactive development that compiles without errors in JavaScript but is ill-typed, error messages from the type-checking pass will sometimes show up a few seconds after your browser reloads.

Therefore, you need to be diligent during interactive development to check for type errors, either in the terminal window where you're running the interactive build command, or in your editor, if you've enabled LSP support.

On the other hand, for production builds and CI, you can rest assured that TypeScript will catch type errors, modulo bugs in our build system configuration.

## LSP support and other tooling

We've tried to configure the project such that LSP and other tooling should "just work" in your editor, but you still might need to do some configuration on your end to hook it up. At the very least, the Nix development shell provides binaries for the TypeScript language server and `eslint` support, so you shouldn't need to download these or otherwise install them in your environment. (However, note to Emacs LSP users: it may prompt you to automatically download a helper, and in our experience, this is usually necessary, for some reason we haven't gotten to the bottom of.)

Probably the easiest way to ensure your editor sees the right environment is to add [`direnv`](https://direnv.net) support to your shell & editor, and then use [`nix-direnv`](https://github.com/nix-community/nix-direnv) to ensure that your editor sees the tools that the Nix shell provides. The project includes an `.envrc` file which will do the right thing once you run `direnv allow` in the project root directory. While it's unusual for a project to include an `.envrc` file, as they're normally personalized by each developer, we found that Vite doesn't work well with a `.direnv` cache in the project's root directory, which is the default location. Configuring `direnv` to place its cache in a different directory is non-trivial, so the `.envrc` file we've provided will place it in `~/.cache/direnv/layouts`. See the following links for details:

* https://github.com/hackworthltd/primer-app/pull/547#issuecomment-1273060657
* https://github.com/direnv/direnv/wiki/Customizing-cache-location

## CI & Chromatic

We use [Chromatic](https://www.chromatic.com), a commercial service that works with Storybook.js to provide per-component, per-commit visual testing and review. Chromatic is automatically run on every trusted pull request on the [primer-app repo](https://github.com/hackworthltd/primer-app). If a PR causes a visible change to the component library, Chromatic will indicate in that PR's checks/statuses section that an approval is necessary before the PR can be committed. You can click on the "details" link for the "UI Tests" and "UI Review" checks to review & approve the changes on the Chromatic web site.

PRs that result in visual changes must be approved in Chromatic's UI before the PR can be committed to the `main` branch via GitHub. Note that only the project maintainers can approve these changes.

The full documentation for this review process is [available here](https://www.chromatic.com/docs/test). Note that the "UI Tests" and "UI Review" approvals are 2 separate workflows with multiple approvals required. (You can ignore the parts of the Chromatic documentation which explain how to set up the integration between GitHub and Chromatic, as that's already been done.)

## SVGs

Before using an SVG in any of the packages, run it through [SVGOMG](https://jakearchibald.github.io/svgomg/) first.

Other suggestions:

* Make sure the SVG has a square aspect ratio.
* Remove any `stroke` or `fill` colors; in React, we can use CSS to control these.

See https://www.youtube.com/watch?v=MbUyHQRq2go&list=PL7CcGwsqRpSM3w9BT_21tUU8JN2SnyckR&index=15 for an 8-minute tutorial.
