<script lang="ts">
	import { untrack } from 'svelte'
	import { cubicOut } from 'svelte/easing'
	import { prefersReducedMotion } from 'svelte/motion'
	import type { TransitionConfig } from 'svelte/transition'

	// One digit place of a NumberRoll. The shown digit is `pos` mod 10, where
	// pos = digit + 10 * wraps. `wraps` is a whole-turn accumulator that only
	// changes to bend a roll the trend's way (and to wrap 9<->0), so the resting
	// position always reads straight off `digit` (correct on the server, with no
	// state to seed from a prop). Cells are absolutely placed at their own offset;
	// only the cells the column is actually rolling across are rendered (one cell
	// at rest, the span of the roll while it moves), so the DOM stays light.
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
	// The two most recent pre-roll positions. Kept while a roll is in flight so
	// the render window still spans the cells the track travels through, and the
	// window still covers a digit caught mid-roll if the value reverses before it
	// settles. Cleared on transitionend so a resting column collapses to one cell.
	let lastPos = $state<number | null>(null)
	let prevPos = $state<number | null>(null)
	let prev: { value: number; digit: number } | undefined
	const pos = $derived(digit + 10 * wraps)

	// Runs before the DOM updates, so `pos` is already at its wrapped target when
	// the track re-renders (one clean transition, no intermediate jump).
	$effect.pre(() => {
		const v = value
		const d = digit
		untrack(() => {
			if (prev && d !== prev.digit) {
				const oldPos = prev.digit + 10 * wraps
				const dir = trend === 'auto' ? Math.sign(v - prev.value) : trend
				// Steps to climb from the old digit up to the new one.
				const up = (((d - prev.digit) % 10) + 10) % 10
				// Up: climb. Down: the same wrap the other way (up - 10, in -9..-1).
				// No trend: the short, possibly-non-wrapping path.
				const delta = dir > 0 ? up : dir < 0 ? up - 10 : d - prev.digit
				// Bend the straight step (d - prev.digit) into `delta` via whole turns.
				wraps += (delta - (d - prev.digit)) / 10
				prevPos = lastPos
				lastPos = oldPos
			}
			prev = { value: v, digit: d }
		})
	})

	// Render only the cells the column is travelling across: the current position
	// and the positions it is rolling from (kept until the roll settles). No
	// margin is needed: cells sit one pitch apart and the window extends exactly
	// half a pitch gap (the mask height) past the 1em glyph box, so a cell outside
	// this span starts at the window's edge and its ink never shows. At rest this
	// is a single cell; reduced motion never rolls, so it is always just the
	// resting digit.
	const cells = $derived.by(() => {
		const cur = Math.round(pos)
		if (prefersReducedMotion.current) {
			return [{ k: cur, label: ((cur % 10) + 10) % 10 }]
		}
		let lo = cur
		let hi = cur
		for (const p of [lastPos, prevPos]) {
			if (p === null) continue
			const r = Math.round(p)
			if (r < lo) lo = r
			if (r > hi) hi = r
		}
		const out: { k: number; label: number }[] = []
		for (let k = lo; k <= hi; k++) {
			out.push({ k, label: ((k % 10) + 10) % 10 })
		}
		return out
	})

	// Once the roll finishes, drop the from-positions so the window collapses back
	// to the resting cell (the leftover cells are off-screen by now, so removing
	// them is invisible).
	function settle() {
		prevPos = null
		lastPos = null
	}

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

<!--
	Layout: .nr-col is the 1ch x 1em box that takes part in layout (a hidden
	in-flow "0" gives it a real text baseline, so the row aligns with surrounding
	text). .nr-win is the clip-and-mask window, one mask height taller than the
	column on each side, so the fade ramp lies entirely outside the resting
	glyph box and the resting digit stays crisp. Cells are spaced one pitch
	(1em + mask) apart, which puts a neighbouring cell's box exactly at the
	window's edge: invisible at rest, dissolving through the ramp as it rolls in.
-->
<span class="nr-col" transition:grow style:--nr-dur="{duration}ms">
	<span class="nr-win">
		<span
			class="nr-track"
			style:transform="translateY(calc({-pos} * var(--nr-pitch)))"
			ontransitionend={settle}
		>
			{#each cells as cell (cell.k)}
				<span
					class="nr-cell"
					style:transform="translateY(calc({cell.k} * var(--nr-pitch)))"
					>{cell.label}</span
				>
			{/each}
		</span>
	</span>
</span>

<style>
	.nr-col {
		display: inline-block;
		position: relative;
		width: 1ch;
		height: 1em;
	}
	.nr-col::before {
		content: '0';
		visibility: hidden;
	}
	.nr-win {
		position: absolute;
		inset: calc(-1 * var(--nr-mask)) 0;
		overflow: hidden;
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent,
			#000 var(--nr-mask),
			#000 calc(100% - var(--nr-mask)),
			transparent
		);
		mask-image: linear-gradient(
			to bottom,
			transparent,
			#000 var(--nr-mask),
			#000 calc(100% - var(--nr-mask)),
			transparent
		);
	}
	.nr-track {
		position: absolute;
		inset: 0;
		transition: transform var(--nr-dur) cubic-bezier(0.65, 0, 0.35, 1);
	}
	.nr-cell {
		position: absolute;
		top: var(--nr-mask);
		left: 0;
		right: 0;
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
