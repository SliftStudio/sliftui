# Slift UI — Dark Docs Design Spec

Reference for building the sliftui.com docs site. Mintlify-grade dark aesthetic with an emerald accent, distilled from a Mobbin study of Mintlify, OpenAI Platform, Supabase, GitBook, Vercel, and Cursor docs. Source: design-research subagent, kept here so we don't lose it.

## Layout — the dark-docs shell

Three columns under a thin sticky top bar.

- **Top bar** (~56–64px, hairline bottom border): left ◆ + "Slift UI" lockup (glyph emerald, text near-white); section tabs with an emerald active underline; centered search pill (~280–360px) with a `⌘K` chip; right side has version switcher, theme toggle (light/dark/system), GitHub link, and an emerald primary CTA.
- **Left sidebar** (240–260px, fixed, own scroll): uppercase muted section headers (11–12px, letter-spacing ~0.06em); items ~14px at 32–36px row height. Active item = emerald text on ~8% emerald fill, radius 6–8px. Hover = brighten text + ~4% white fill.
- **Content** (max ~768px, padding 32–48px): emerald eyebrow, H1, muted one-line lede. Top-right "Copy page" dropdown (Markdown / View as Markdown / Open in ChatGPT / Claude).
- **Right TOC** (~200–240px, sticky): "On this page", h2/h3 anchors ~13px, active in emerald, h3 indented. TOC drops <1280px; sidebar collapses behind a hamburger <1024px.

## Color tokens (drop-in)

```css
:root {
	--color-bg: #0a0a0b;
	--color-bg-subtle: #0e0e10;
	--color-surface: #151517;
	--color-surface-hover: #1c1c1f;
	--color-code-bg: #0d0d0f;
	--color-code-header: #161618;
	--color-inline-code: #1e1e22;
	--color-border: #26262a;
	--color-border-strong: #34343a;
	--color-text: #ededef;
	--color-text-secondary: #a1a1aa;
	--color-text-muted: #6e6e76;
	--color-accent: #34d399; /* emerald-400, resting accent */
	--color-accent-hover: #10b981; /* emerald-500, button/hover fill */
	--color-accent-subtle: rgba(52, 211, 153, 0.1);
	--color-accent-border: rgba(52, 211, 153, 0.3);
	--color-accent-contrast: #04130c; /* text on solid emerald */
	--focus-ring: 0 0 0 2px rgba(52, 211, 153, 0.5);

	--font-sans: 'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif;
	--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
	--text-h1: 2rem;
	--text-h2: 1.5rem;
	--text-h3: 1.25rem;
	--text-h4: 1rem;
	--text-body: 0.9375rem;
	--text-small: 0.8125rem;
	--text-code: 0.8125rem;
	--leading-body: 1.7;

	--radius-sm: 6px;
	--radius-md: 10px;
	--radius-lg: 12px;
	--space-1: 0.25rem;
	--space-2: 0.5rem;
	--space-3: 0.75rem;
	--space-4: 1rem;
	--space-5: 1.5rem;
	--space-6: 2rem;
	--space-8: 3rem;

	--sidebar-w: 256px;
	--toc-w: 224px;
	--content-max: 768px;
	--topbar-h: 60px;
}
```

Type scale weights/spacing: H1 32px/600/-0.02em, H2 24px/600/-0.015em, H3 20px/600/-0.01em, H4 16px/600, body 15px/1.7, small/caption 13px, sidebar section header 11px/600/uppercase/0.06em.

## Signature components

- **Code block**: container `--code-bg`, 1px `--border`, radius 12px. Header bar (`--code-header-bg`, ~40px, bottom hairline) with filename/lang label left and a ghost copy button right (swaps to check on copy); multi-language uses header tabs. Body padding 16px 20px; optional muted line numbers. Syntax: text `#C9C9CF`, comments `#6E6E76` italic, keywords `#C792EA`, strings `#9ECE6A`, functions `#82AAFF`, numbers `#F78C6C`, tags `#7FDBCA` (Tokyo-Night / One-Dark family on near-black).
- **Callouts**: rounded 10px, 1px border, tinted bg, leading icon. Note=blue `rgba(56,139,253,.08)`/border `.25`; Tip=emerald (`--accent-subtle`/`--accent-border`); Warning=amber `rgba(245,176,66,.08)`; Danger=red `rgba(248,81,73,.08)`.
- **Cards / grids**: `--surface` bg, 1px `--border`, radius 12px, padding 20–24px, tinted-emerald icon square + bold 16px title + muted 14px desc. 2-up/3-up, gap 16px. Hover: border → `--accent-border`, bg → `--surface-hover`, optional translateY(-1px), ~150ms.
- **Tabs**: underline style, active = primary text + 2px emerald underline.
- **API param table**: list rows, mono semibold name + muted type chip + required pill + muted description line, hairline separators; right rail shows live request/response code with 200/400 tabs.
- **⌘K palette**: centered modal ~560–640px, `--surface`, 1px `--border-strong`, radius 12px, backdrop blur + `rgba(0,0,0,.5)` scrim. Grouped results (uppercase muted headers), leading icons, right-side `↵`/shortcut hints, active = `--accent-subtle` + emerald.
- **Badges**: 11–12px, padding 2px 8px, radius 6px. Method colors (GET green/POST blue/DELETE red); "New" = accent-subtle + accent text + accent-border.

## Motion & detail

150ms ease for color/bg/border; 200ms ease-out for the ⌘K modal (scale .98→1 + fade); nothing bouncy. Focus ring = `--focus-ring`. Headings reveal a muted `#` anchor on hover, smooth-scroll, scroll-spy syncs the TOC. Sidebar groups collapse with a 90° chevron; thin overlay scrollbars.

## Application rules (to hit the Mintlify feel)

- Backgrounds layer upward ~+5 lightness per level (bg → bg-subtle → surface → surface-hover); never pure black/white.
- Borders do the work, not shadows (shadows nearly absent; at most a faint one on the ⌘K modal/dropdowns).
- Emerald only on: logo glyph, links, active nav/TOC, section eyebrow, focus ring, primary button, success/"New" badges. Everything else neutral.
- Prose column 768px, body 15px/1.7 — the airy line-height is a big part of the premium read.

## Standout references (dark mode)

Mintlify (the benchmark), OpenAI Platform (true near-black + 3-state theme toggle), Vercel (best ⌘K palette), Supabase (dense dev layout + IDE syntax theme), Cursor (code-forward pages with copy/wrap controls).

> Caveat from research: the Mobbin Mintlify captures were a dimmed/"dawn" theme, so the deepest near-black values and the syntax palette were calibrated from genuinely-black OpenAI/Supabase/Cursor references plus knowledge of Mintlify's true dark mode.
