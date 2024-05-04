# Primer App

Primer is a pedagogical functional programming language. This
repository contains a collection of [React](https://react.dev)
components to support Primer programming-related activities, including
reading, writing, running, and debugging Primer programs. The project
also provides a web application which integrates these components into
a novel visual programming environment, featuring a
[tree-based](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
[structure editor](https://en.wikipedia.org/wiki/Structure_editor).

For the moment, we're focusing on the development of the integrated
web app, but our long-term goal is to make it possible to use the
project's React components to integrate Primer programming activities
into interactive applications and games.

The web app in this project currently requires that a Primer language
server instance is available. We provide a Haskell implementation of a
Primer language server in this project's companion repository,
[`primer`](https://github.com/hackworthltd/primer). Both projects are
licensed under the terms of [version 3 (or later) of the GNU Affero
General Public License](COPYING), and can be freely copied, modified,
and distributed, so long as the license is preserved.

# Important caveats

The Primer programming language, our Primer language server
implementation, and this web app are all still under heavy
development. Expect lots of breaking changes until we reach stable
releases of all of these components. Please note that we don't
currently have any accurate time estimates for when we expect to reach
these milestones.

This web app, in particular, should be considered to be of
alpha-release quality. There are many incomplete and altogether
missing features, known bugs, and visual & usability defects. While
it's already possible to write at least some Primer programs using
this web app, **please keep in mind the following important caveats
about the current state of the project**:

* We've yet to do any rigorous testing of Primer with students, and
  none at all in classrooms. Primer may turn out not be an effective
  way to teach functional programming to novices! That said, if you're
  an educator and you'd like to know more about the limited testing we
  *have* done to date, please reach out to us. As some important
  features are still missing from the web app, we don't recommend that
  you try to use Primer for any serious teaching at this time.

* At the moment, this project requires access to a Primer language
  server instance, so you should also familiarize yourself with [that
  project's
  caveats](https://github.com/hackworthltd/primer#important-caveats),
  as well. Running a Primer language server instance is relatively
  easy if you're a developer, as we provide a [Docker image for
  it](https://github.com/hackworthltd/primer/pkgs/container/primer-service),
  but we're aware that many educators may not have the time or
  knowledge to do this themselves. In the not-too-distant future, we
  hope to be able to run the development environment in the browser,
  without requiring a server instance.

* All of our UX design has been done with
  [accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
  (*a11y*) in mind, and our 1.0 release will have robust support for
  it, but the current implementation is lacking. As we're not a11y
  experts, if you'd like to make an important
  [contribution](#contributing) to the project, this would be a
  particularly impactful area in which to do it.

* One of the primary goals of the Primer programming language is to
  support programming activities in the student's native language, so
  that the ability to read and write English is not a prerequisite for
  learning to program. As such, the Primer language server API is
  mostly natural language-neutral; e.g., the API reports errors as
  symbolic values, rather than as text strings intended to be shown to
  the student verbatim. Full
  [internationalization](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization)
  (*i18n*) support is left to clients of the Primer API, such as this
  web app. However, for practical and resource-related reasons, our
  initial web app implementation only fully supports English. We'll
  make a best-effort attempt to support a few other widely-spoken
  natural languages in our 1.0 release, and robust i18n support will
  be a high priority in post-1.0 releases, but this is another area in
  which community members could make an impactful
  [contribution](#contributing) to the project.

* At the moment, Primer is a pure functional programming language,
  with no effects system. This means, for example, it's not currently
  possible to [draw animated cats](https://scratch.mit.edu) using
  Primer. We plan to implement an effects system in version 2.0 of the
  language specification and this web app, but that will work will not
  begin for some time. Version 1.0 of Primer will focus on teaching
  fundamental functional programming concepts, such as functions,
  types, expressions, and program evaluation.
  
# Contributing

We welcome contributions from the community! Please read our
[contributing guide](CONTRIBUTING.md) if you think you'd like to help.

We also provide a comprehensive [development
guide](docs/development-guide-toc.md) for anyone who'd like to build
and run the project locally.

# Third-party licenses

Some third-party assets that we distribute together with this
project's source code (e.g., open source fonts) are licensed
separately from the source code. For each such asset, there's a
corresponding license file in the `licenses` subdirectory of the
project.

We have also "vendored" some source code from third-party libraries;
i.e., we have included a few third-party source code files directly in
this project, rather than linking to them as a pre-built dependency.
When this is the case, the source files will include their license and
copyright notice directly in the source file.
