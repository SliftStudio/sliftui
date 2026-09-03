<script lang="ts">
	import { cubicOut } from 'svelte/easing'
	import { prefersReducedMotion } from 'svelte/motion'
	import type { TransitionConfig } from 'svelte/transition'
	import NumberRollDigit from './NumberRollDigit.svelte'

	// A small, dependency-free odometer. Renders a number as a row of place
	// columns; each digit column (NumberRollDigit) rolls to its new digit when
	// `value` changes via a CSS transform transition. By default every digit rolls
	// in the direction the whole number moved, wrapping 9<->0 as needed, like a
	// real odometer; pass `trend` to force a direction (1 up, -1 down) or 0 to let
	// each digit take its own shortest path. Plain DOM (no custom element / shadow
	// DOM), so the prerendered page stays hydration-clean. Each digit column has a
	// soft mask just above and below the glyph box so rolling digits dissolve at
	// the boundary; symbols never roll, so they are left unmasked. Inherits font
	// size, weight and colour from its parent; honours prefers-reduced-motion.
	let {
		value,
		format,
		locales,
		duration = 720,
		trend = 'auto',
		class: klass,
	}: {
		value: number
		format?: Intl.NumberFormatOptions
		locales?: Intl.LocalesArgument
		duration?: number
		trend?: 1 | 0 | -1 | 'auto'
		class?: string
	} = $props()

	// Grouping off by default so a bare integer reads "2013", not "2,013"; callers
	// can opt back in or add fraction digits via `format`.
	const formatter = $derived(
		new Intl.NumberFormat(locales, { useGrouping: false, ...format }),
	)

	type Slot =
		| { key: string; kind: 'digit'; digit: number }
		| { key: string; kind: 'sym'; char: string }

	// Flatten the formatted number to one cell per character, then key each by its
	// distance from the right end so equivalent places line up across values (the
	// ones digit is always key d0, the decimal point a fixed s-key, and so on).
	const slots = $derived.by<Slot[]>(() => {
		const chars: { kind: 'digit' | 'sym'; v: string }[] = []
		for (const part of formatter.formatToParts(value)) {
			if (part.type === 'integer' || part.type === 'fraction') {
				for (const c of part.value) chars.push({ kind: 'digit', v: c })
			} else {
				chars.push({ kind: 'sym', v: part.value })
			}
		}
		const n = chars.length
		return chars.map((c, i) => {
			const place = n - 1 - i
			return c.kind === 'digit'
				? { key: `d${place}`, kind: 'digit', digit: Number(c.v) }
				: { key: `s${place}`, kind: 'sym', char: c.v }
		})
	})

	function grow(node: HTMLElement): TransitionConfig {
		const w = node.getBoundingClientRect().width
		return {
			duration: prefersReducedMotion.current ? 0 : duration * 0.7,
			easing: cubicOut,
			css: (t) => `width:${t * w}px;opacity:${t}`,
		}
	}
</script>

<span class={['nr', klass]} role="img" aria-label={formatter.format(value)}>
	{#each slots as slot (slot.key)}
		{#if slot.kind === 'digit'}
			<NumberRollDigit {value} digit={slot.digit} {trend} {duration} />
		{:else}
			<span class="nr-sym" transition:grow>{slot.char}</span>
		{/if}
	{/each}
</span>

<style>
	.nr {
		/* Height of the fade ramp above and below each digit column (the same
		   mask-gradient trick NumberFlow uses). The ramp sits outside the 1em
		   glyph box, so the resting digit is never touched by it; cells are
		   spaced one pitch apart so a neighbouring digit starts exactly where the
		   ramp ends. Override --nr-mask on the element to tune the dissolve. */
		--nr-mask: 0.25em;
		--nr-pitch: calc(1em + var(--nr-mask));
		display: inline-flex;
		font-variant-numeric: tabular-nums;
		line-height: 1;
		vertical-align: baseline;
	}
	.nr-sym {
		display: inline-block;
		text-align: center;
	}
</style>
