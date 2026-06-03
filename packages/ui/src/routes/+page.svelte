<script lang="ts">
	import NumberRoll from '$lib/NumberRoll.svelte'

	// Hero figure: a plausible "revenue" number the visitor can nudge.
	let revenue = $state(48213)
	// A small stat grid that all moves together when you shuffle.
	let users = $state(1280)
	let rating = $state(4.8)
	let uptime = $state(99.9)

	const nudge = (d: number) => (revenue = Math.max(0, revenue + d))
	function shuffle() {
		const ri = (lo: number, hi: number) =>
			Math.floor(lo + Math.random() * (hi - lo))
		revenue = ri(1000, 99000)
		users = ri(200, 9900)
		rating = Math.round((3.5 + Math.random() * 1.5) * 10) / 10
		uptime = Math.round((98 + Math.random() * 2) * 10) / 10
	}

	const stats = $derived([
		{ label: 'Active users', value: users, format: undefined },
		{
			label: 'Avg rating',
			value: rating,
			format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
		},
		{
			label: 'Uptime',
			value: uptime,
			format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
			suffix: '%',
		},
	])
</script>

<svelte:head>
	<title>Slift UI — NumberRoll</title>
	<meta
		name="description"
		content="Polished, dependency-free Svelte 5 components from Slift. Starting with NumberRoll, an animated odometer-style number."
	/>
</svelte:head>

<main>
	<header class="hero">
		<div class="brand">◆ slift<span>ui</span></div>
		<h1>Numbers that <em>roll</em>.</h1>
		<p class="tagline">
			A polished, dependency-free Svelte&nbsp;5 component library. First up:
			<code>NumberRoll</code>, an odometer-style number where every digit rolls
			in the direction the value moved.
		</p>

		<div class="figure" style="--size: clamp(3rem, 12vw, 6.5rem)">
			<span class="money"
				>$<NumberRoll value={revenue} format={{ useGrouping: true }} /></span
			>
			<div class="controls">
				<button onclick={() => nudge(-1337)}>−</button>
				<button onclick={shuffle}>shuffle</button>
				<button onclick={() => nudge(2470)}>+</button>
			</div>
		</div>
	</header>

	<section class="stats">
		{#each stats as s (s.label)}
			<div class="stat">
				<div class="num">
					<NumberRoll value={s.value} format={s.format} />{s.suffix ?? ''}
				</div>
				<div class="lab">{s.label}</div>
			</div>
		{/each}
	</section>

	<section class="install">
		<h2>Add it to your project</h2>
		<div class="cols">
			<div>
				<h3>Copy the source (own it)</h3>
				<pre><code>npx slift add number-roll</code></pre>
				<p>Drops the <code>.svelte</code> files straight into your project.</p>
			</div>
			<div>
				<h3>Or install the package</h3>
				<pre><code>npm i @slift/ui</code></pre>
				<pre><code
						>{`<script>
  import { NumberRoll } from '@slift/ui'
  let n = $state(0)
</` +
							`script>

<button onclick={() => n++}>
  <NumberRoll value={n} />
</button>`}</code
					></pre>
			</div>
		</div>
	</section>

	<footer>
		<span>Slift UI</span>
		<span>MIT licensed</span>
		<span>Requires Svelte ≥ 5.16</span>
	</footer>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #0a0a0b;
		color: #e7e7ea;
		font-family:
			ui-sans-serif,
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	main {
		max-width: 60rem;
		margin: 0 auto;
		padding: 4rem 1.5rem 6rem;
	}
	.brand {
		font-weight: 700;
		letter-spacing: -0.02em;
		color: #34d399;
		font-size: 1.05rem;
	}
	.brand span {
		color: #71717a;
	}
	.hero h1 {
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
		margin: 1.5rem 0 0;
		font-weight: 700;
	}
	.hero h1 em {
		font-style: normal;
		color: #34d399;
	}
	.tagline {
		max-width: 34rem;
		color: #a1a1aa;
		font-size: 1.1rem;
		line-height: 1.6;
	}
	code {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		color: #e4e4e7;
		background: #18181b;
		padding: 0.1em 0.35em;
		border-radius: 0.35rem;
		font-size: 0.9em;
	}
	.figure {
		margin-top: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: flex-start;
	}
	.money {
		display: inline-flex;
		align-items: baseline;
		font-size: var(--size);
		font-weight: 700;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.controls {
		display: flex;
		gap: 0.5rem;
	}
	.controls button {
		font: inherit;
		font-size: 0.95rem;
		font-weight: 500;
		color: #e4e4e7;
		background: #18181b;
		border: 1px solid #27272a;
		border-radius: 0.6rem;
		padding: 0.45rem 1rem;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.controls button:hover {
		background: #27272a;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 4rem;
	}
	.stat {
		background: #1112;
		border: 1px solid #1f1f23;
		border-radius: 1rem;
		padding: 1.5rem;
	}
	.stat .num {
		font-size: 2rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		display: inline-flex;
		align-items: baseline;
	}
	.stat .lab {
		margin-top: 0.4rem;
		color: #a1a1aa;
		font-size: 0.85rem;
	}
	.install {
		margin-top: 5rem;
	}
	.install h2 {
		font-size: 1.5rem;
		letter-spacing: -0.02em;
	}
	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-top: 1.5rem;
	}
	.cols h3 {
		font-size: 1rem;
		color: #d4d4d8;
	}
	pre {
		background: #18181b;
		border: 1px solid #27272a;
		border-radius: 0.6rem;
		padding: 1rem;
		overflow-x: auto;
	}
	pre code {
		background: none;
		padding: 0;
		color: #d4d4d8;
		font-size: 0.85rem;
		line-height: 1.6;
	}
	footer {
		margin-top: 5rem;
		padding-top: 2rem;
		border-top: 1px solid #1f1f23;
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		color: #71717a;
		font-size: 0.85rem;
	}
	@media (max-width: 40rem) {
		.stats,
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
