<script lang="ts">
	import { untrack } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { prefersReducedMotion } from 'svelte/motion'
	import type { TransitionConfig } from 'svelte/transition'

	// One digit place of a NumberRoll. The shown digit is `pos` mod 10, where
	// pos = digit + 10 * wraps. `wraps` is a whole-turn accumulator that only
	// changes to bend a roll the trend's way (and to wrap 9<->0), so the resting
	// position always reads straight off `digit` (correct on the server, with no
	// state to seed from a prop). Cells are absolutely placed at their own offset
	// and only a window of them around the current position is rendered, so the
	// window shifting never disturbs the in-flight transform.
	let {
		value,
		digit,
		trend,
		duration,
	}: {
		value: number
		digit: number
		trend: 1 | 0 | -1 | 'auto'
		duration: number
	} = $props()

	let wraps = $state(0)
	let prev: { value: number; digit: number } | undefined
	const pos = $derived(digit + 10 * wraps)

	// Runs before the DOM updates, so `pos` is already at its wrapped target when
	// the track re-renders (one clean transition, no intermediate jump).
	$effect.pre(() => {
		const v = value
		const d = digit
		untrack(() => {
			if (prev && d !== prev.digit) {
				const dir = trend === 'auto' ? Math.sign(v - prev.value) : trend
				// Steps to climb from the old digit up to the new one.
				const up = (((d - prev.digit) % 10) + 10) % 10
				// Up: climb. Down: the same wrap the other way (up - 10, in -9..-1).
				// No trend: the short, possibly-non-wrapping path.
				const delta = dir > 0 ? up : dir < 0 ? up - 10 : d - prev.digit
				// Bend the straight step (d - prev.digit) into `delta` via whole turns.
				wraps += (delta - (d - prev.digit)) / 10
			}
			prev = { value: v, digit: d }
		})
	})

	// A window of cells around the current position, each labelled with its own
	// digit (its offset mod 10). Wide enough to cover a full single roll either
	// way plus a little slack for a mid-roll reversal.
	const WINDOW = 10
	const cells = $derived.by(() => {
		const centre = Math.round(pos)
		const out: { k: number; label: number }[] = []
		for (let k = centre - WINDOW; k <= centre + WINDOW; k++) {
			out.push({ k, label: ((k % 10) + 10) % 10 })
		}
		return out
	})

	// A leading column that appears (or leaves) grows its width from/to zero while
	// fading, so the row's width change reads as smooth.
	function grow(node: HTMLElement): TransitionConfig {
		const w = node.getBoundingClientRect().width
		return {
			duration: prefersReducedMotion.current ? 0 : duration * 0.7,
			easing: cubicOut,
			css: (t) => `width:${t * w}px;opacity:${t}`,
		}
	}
</script>

<span class="nr-col" transition:grow style:--nr-dur="{duration}ms">
	<span class="nr-track" style:transform="translateY({-pos}em)">
		{#each cells as cell (cell.k)}
			<span class="nr-cell" style:transform="translateY({cell.k}em)"
				>{cell.label}</span
			>
		{/each}
	</span>
</span>

<style>
	.nr-col {
		display: inline-block;
		position: relative;
		width: 1ch;
		height: 1em;
		overflow: hidden;
	}
	.nr-track {
		position: absolute;
		inset: 0;
		transition: transform var(--nr-dur) cubic-bezier(0.65, 0, 0.35, 1);
	}
	.nr-cell {
		position: absolute;
		inset: 0;
		height: 1em;
		line-height: 1em;
		text-align: center;
	}
	@media (prefers-reduced-motion: reduce) {
		.nr-track {
			transition: none;
		}
	}
</style>
