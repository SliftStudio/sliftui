# Roadmap

Ideas and planned work for `@slift/ui`. Nothing here is committed to a timeline.

## Copy-in distribution (shadcn-style registry)

Offer a second way to consume components alongside the npm package: a registry that a CLI can read to copy a component's source straight into a consumer's project, instead of adding a runtime dependency. This is the model [shadcn-svelte](https://shadcn-svelte.com/) popularized (`npx shadcn-svelte add <component>`), and it can be driven through the `slift` CLI (`slift add number-roll`) or made compatible with the shadcn CLI.

Why it fits this library:

- The components are dependency-free. NumberRoll only uses Svelte's own `easing`, `motion`, and `transition`, so "add one component" is just dropping its source files in, with nothing to install.
- A registry entry lists every file an item needs, so NumberRoll ships together with its internal `NumberRollDigit` as one self-contained unit.

Trade-off to document for users: copy-in means they own and can freely edit the code, but they do not get automatic updates the way `npm i @slift/ui` users do. The two channels serve different audiences and can share the same source files.

Rough shape:

- Define a registry (JSON describing each item plus its source files), hostable as static files on the site or from GitHub.
- Wire it through the `slift` CLI and/or make the entries compatible with `npx shadcn-svelte add <url>`.
