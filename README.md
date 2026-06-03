<div align="center">

# ◆ Slift

**Polished, dependency-free Svelte 5 components, by [Slift](https://slift.co).**

</div>

Slift is a small, opinionated UI toolkit for Svelte 5. Copy a component straight into your project so you own and can edit the code, or install it as a normal package if you prefer. No runtime dependencies, and code that reads like you wrote it yourself.

This is the monorepo. It ships three packages:

| Package                       | npm         | What it is                                                                                        |
| ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| [`@slift/ui`](packages/ui)    | `@slift/ui` | The component library. Starts with `NumberRoll`.                                                  |
| [`slift`](packages/cli)       | `slift`     | The CLI. `npx slift add number-roll` copies a component's source into your project, shadcn-style. |
| [`sliftui`](packages/sliftui) | `sliftui`   | A convenience alias that re-exports `@slift/ui` (matches the website name).                       |

The `packages/ui` project is also the docs and demo site (`src/routes`); it will live at **sliftui.com**.

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

`@slift/ui` grows one component at a time, each one finished before the next. The `slift` CLI starts with `add` and will pick up more commands as it goes. Premium kits (Figma, Framer, Webflow, WordPress) may follow under the same brand.

## License

MIT © Slift
