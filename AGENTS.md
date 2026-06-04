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
