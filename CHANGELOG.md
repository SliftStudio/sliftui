# Changelog

## [0.0.2] - 2026-06-04

### Changed

- NumberRoll now renders only the digit cells it is actively rolling across: one cell per column at rest, expanding to the span of a roll while it animates and collapsing back once it settles. Previously every column kept a fixed 21-cell window mounted at all times. The animation looks identical, but the resting DOM shrinks dramatically (a 16-digit readout drops from 357 cells to 16, around 95% fewer nodes).

## [0.0.1] - 2026-06-03

### Added

- Initial release of `@slift/ui` with NumberRoll, a dependency-free Svelte 5 odometer-style number. Each digit rolls in the direction the value moved, wraps 9 to 0 like a real odometer, honors `prefers-reduced-motion`, and inherits its parent's font size, weight, and color.
