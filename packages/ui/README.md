# @slift/ui

Polished, dependency-free Svelte 5 components from [Slift](https://sliftui.com). The first one is **NumberRoll**, an animated odometer-style number.

```bash
npm i @slift/ui
```

Prefer to own the source? Copy it straight into your project instead:

```bash
npx slift add number-roll
```

Requires **Svelte ≥ 5.16**. No runtime dependencies, no custom elements, no shadow DOM, so it renders and hydrates cleanly on prerendered/SSR pages.

## NumberRoll

Each digit place is a vertical strip that rolls to its new value with a CSS transform transition. By default every digit rolls in the direction the whole number moved (wrapping 9↔0 like a real odometer), the top and bottom edges are softly masked so digits dissolve at the boundary, and `prefers-reduced-motion` is respected.

```svelte
<script>
  import { NumberRoll } from '@slift/ui'

  let count = $state(0)
</script>

<button onclick={() => (count += 7)}>
  <NumberRoll value={count} />
</button>
```

It inherits font size, weight and color from its parent, so style the wrapper, not the component.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | required | The number to display. Changing it animates the roll. |
| `format` | `Intl.NumberFormatOptions` | `{ useGrouping: false }` | Passed to `Intl.NumberFormat`. Add fraction digits, grouping, currency, etc. |
| `locales` | `Intl.LocalesArgument` | — | Locale(s) for formatting. |
| `duration` | `number` | `720` | Roll duration in milliseconds. |
| `trend` | `1 \| 0 \| -1 \| 'auto'` | `'auto'` | Roll direction. `'auto'` follows the value's change; `1` always up; `-1` always down; `0` lets each digit take its shortest path. |
| `class` | `string` | — | Extra class on the root element. |

### Examples

```svelte
<!-- A formatted price -->
<NumberRoll value={total} format={{ style: 'currency', currency: 'USD' }} />

<!-- One decimal place, always counting up -->
<NumberRoll value={rating} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} trend={1} />

<!-- A snappier roll -->
<NumberRoll value={n} duration={450} />
```

## License

MIT © Slift
