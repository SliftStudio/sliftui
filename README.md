<div align="center">

# ◆ Slift

**Polished, dependency-free Svelte 5 components, by [Slift](https://sliftui.com).**

</div>

Slift is a small, opinionated UI toolkit for Svelte 5. Components are designed to be copied into your project (so you own and can edit the code), or installed as a normal package if you prefer. The philosophy: real craft, no runtime dependencies, and code you would be happy to have written yourself.

This is the monorepo. It ships three packages:

| Package | npm | What it is |
| --- | --- | --- |
| [`@slift/ui`](packages/ui) | `@slift/ui` | The component library. Starts with `NumberRoll`. |
| [`slift`](packages/cli) | `slift` | The CLI. `npx slift add number-roll` copies a component's source into your project, shadcn-style. |
| [`sliftui`](packages/sliftui) | `sliftui` | A convenience alias that re-exports `@slift/ui` (matches the website name). |

The `packages/ui` project is also the **[sliftui.com](https://sliftui.com)** docs/demo site (`src/routes`).

## Quick start

```bash
# install the library
npm i @slift/ui

# or copy the source straight in
npx slift add number-roll
```

```svelte
<script>
  import { NumberRoll } from '@slift/ui'
  let n = $state(0)
</script>

<button onclick={() => n++}>
  <NumberRoll value={n} />
</button>
```

Requires Svelte ≥ 5.16.

## Develop

This is a [pnpm](https://pnpm.io) workspace.

```bash
pnpm install      # install all packages
pnpm dev          # run the @slift/ui docs/demo site
pnpm build        # build @slift/ui (svelte-package) and the slift CLI
pnpm check        # type-check everything
```

## Roadmap

`@slift/ui` grows one well-made component at a time. The `slift` CLI is the front door and will gain more than `add` over time. Premium kits (Figma, Framer, Webflow, WordPress) may follow under the same brand.

## License

MIT © Slift
