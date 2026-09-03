# Changelog

## [Unreleased]

### Fixed

- The edge-fade mask no longer touches resting glyphs. It used to cover the whole row with its ramp inside the 1em line box, which softened the bottom of every digit and faded the descender of a comma and the bar of a currency sign. The mask now lives on each digit column in a window one mask height taller than the glyph box, so the ramp only ever meets a digit in flight; symbols are not masked at all. `--nr-mask` (default 0.25em) still tunes the dissolve.
- Digit columns now carry a real text baseline, so the number sits on the same baseline as surrounding text instead of about 0.125em above it.

## [0.0.3] - 2026-06-05

### Changed

- Published with provenance now that the source repo is public, and `CHANGELOG.md` is bundled with the package and linked from the README. No changes to the component itself.

## [0.0.2] - 2026-06-04

### Changed

- NumberRoll now renders only the digit cells it is actively rolling across: one cell per column at rest, expanding to the span of a roll while it animates and collapsing back once it settles. Previously every column kept a fixed 21-cell window mounted at all times. The animation looks identical, but the resting DOM shrinks dramatically (a 16-digit readout drops from 357 cells to 16, around 95% fewer nodes).

## [0.0.1] - 2026-06-03

### Added

- Initial release of `@slift/ui` with NumberRoll, a dependency-free Svelte 5 odometer-style number. Each digit rolls in the direction the value moved, wraps 9 to 0 like a real odometer, honors `prefers-reduced-motion`, and inherits its parent's font size, weight, and color.
