# AGENTS.md

Guidance for AI agents and contributors working in this repo.

## What this is

`@slift/ui` is a small, dependency-free Svelte 5 component library. The public API is whatever `src/lib/index.ts` exports. Today that is `NumberRoll`, an animated odometer-style number; `NumberRollDigit` ships alongside it but is internal.

## Conventions

- Components live in `src/lib/`. Export public ones from `src/lib/index.ts`; keep internal sub-components unexported.
- Svelte 5 runes. No runtime dependencies, no custom elements, no shadow DOM, so components render and hydrate cleanly on SSR/prerendered pages.
- Validate any `.svelte` change with the Svelte MCP autofixer, then run `pnpm check` (must be clean) and `pnpm format`.

## Commands

- `pnpm dev` — run the showcase app
- `pnpm check` — svelte-check / type check
- `pnpm prepack` — build the publishable `dist/` (svelte-package + publint)

## Releasing

Follow [RELEASING.md](./RELEASING.md). In short: bump the version, add a CHANGELOG entry, commit, tag, push, then run the `release.yml` workflow (npm OIDC trusted publishing, no token).

## Naming constraints (permanent, do not relitigate)

- The GitHub org is `SliftStudio`, not `slift`. The `slift` username was taken
  by an inactive account in 2014 and GitHub will not release inactive names, so
  every literal GitHub path carries `SliftStudio`. Everywhere else the name is
  lowercase `slift`.
- The npm scope is `@slift`. The unscoped `slift` package name is blocked by
  npm's similarity filter (too close to sift, split, eslint). Only a trademark
  appeal could override it, and that is deferred indefinitely.

Both cost real effort to rediscover and neither can be changed, so treat them as
settled rather than as open naming questions.
