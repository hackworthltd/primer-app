# Frequently-asked questions (FAQ) about the project

*Note: this FAQ does not cover the syntax, semantics, or design of the
Primer programming language, nor does it cover this project's
accompanying Primer language server project,
[`primer`](https://github.com/hackworthltd/primer/blob/main/docs/project-faq.md).
It is only an FAQ for questions about this project, its React
components, and its web application.*

## Does this project support tablets and phones?

Yes. The Primer programming language, and our implementation of it, in
particular, were specifically designed with modern computing platforms
in mind, including tablets, phones, and other touch-based UIs.
Specifically:

* The application's UI/UX has been designed from the start for
  touch-based interactions. For example, we've intentionally avoided
  any reliance on hover modalities, or other pointer-based interface
  affordances.

* Our structure editor, combined with the Primer language's integrated
  support for atomic editing actions, requires very little typing. For
  the most part, students only need to use a keyboard when giving
  names to types, terms, modules, and programs; or when searching for
  them.

* By developing for the web, our application is available on
  practically every general-purpose computing device in use today.

* Because most of the computing-intensive tasks in our implementation
  can be done server-side, even very low-performance devices can be
  used to develop and run Primer programs. This also translates to
  less battery drain on mobile devices.

Note that phone screen sizes make for challenging UX issues for any
programming environment, let alone a visual one with lots of UI
"chrome," so for version 1.0, developing Primer programs on a phone,
while possible, will probably not be particularly ergonomic. We'll
make good UX on phones a higher priority after the 1.0 release of the
web app.

## Why is this project composed of a collection of React components? Why not a native mobile application, for example?

Please see our [`primer`
FAQ](https://github.com/hackworthltd/primer/blob/main/docs/project-faq.md#why-this-design-why-not-just-a-standard-compiler-or-interpreter)
for a more complete answer, but in a nutshell, we'd like to support
pedagogical approaches that introduce students to programming via
school subjects other than computer science, and we feel that the best
way to do that, from a technical perspective, at least, is by
developing reusable web components for integrating programming
activities into other interactive applications and games.

## Given the choice of Haskell for the backend implementation, why choose TypeScript for the frontend implementation?

Given that the frontend application and its constituent components are
intended to be run in the browser, we didn't feel that Haskell was a
good enough browser application language for our needs. We hope that
GHC 9.6 and later versions will make it possible to run most of the
backend code in the browser (i.e., the type checker, evaluator, and
actions engine), which would eliminate the need for a server instance
for most Primer programming activities, but it seems very unlikely
that we would ever implement the frontend UI in Haskell.

Our initial frontend prototype was written in
[PureScript](https://www.purescript.org), but once we shifted into
production application development in the fall of 2021, we felt that
we'd be better off switching to TypeScript and, in particular, the
[React](https://react.dev) ecosystem. We found that, during the
prototype's development, we were reinventing too many basic UI
components in PureScript, most of which already had numerous robust
implementations in React. (We also felt at the time that,
unfortunately, it was too big a risk to the project to try integrating
React components into a PureScript frontend application.)
