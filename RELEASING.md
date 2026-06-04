# Releasing @slift/ui

How a new version of `@slift/ui` is cut and published. Publishing runs through GitHub Actions with npm OIDC trusted publishing, so no npm token is stored anywhere.

## Prerequisites (one-time, already configured)

- A trusted publisher is set on npm for `@slift/ui`: GitHub Actions, `SliftStudio/sliftui`, workflow `release.yml`.
- Token-based publishing is disallowed for the package, so the only ways to publish are this workflow (over OIDC) or an interactive `npm login` with 2FA.

## 1. Land the change

Add or change the component on `main`, directly or via PR:

- New components live in `src/lib/` and are exported from `src/lib/index.ts`. Internal sub-components (like `NumberRollDigit`) are not exported.
- Validate every `.svelte` file with the Svelte autofixer, then run `pnpm check` (svelte-check must be clean) and `pnpm format`.
- Keep components dependency-free wherever possible.

## 2. Choose the version (SemVer)

The package is in `0.x`, where any release is allowed to break.

- **Patch** (`0.0.x`): bug fixes, or internal changes with no API or output change.
- **Minor** (`0.x.0`): a new component, or a new feature/prop on an existing one.
- **Major**: deferred until `1.0.0`, when the API becomes a stability promise.

Bump `version` in `package.json`. npm rejects re-publishing an existing version, so every release needs a fresh number.

## 3. Update CHANGELOG.md

Add a section at the top (newest first) in Keep a Changelog style:

```md
## [0.1.0] - YYYY-MM-DD

### Added

- ...

### Changed

- ...

### Fixed

- ...
```

Use only the subsections you need. Write for humans: what changed and why it matters, not the diff.

## 4. Commit, tag, push

- Commit in logical chunks. A release commit pairs the `package.json` bump with the CHANGELOG entry.
- Tag the release commit and push `main` with the tag:

```bash
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main --follow-tags
```

## 5. Publish

Trigger the Release workflow, which builds and publishes to npm over OIDC trusted publishing (no token). Provenance is intentionally off while this repo is private (npm provenance requires a public source repo); if it ever goes public, add `--provenance` back to the publish step.

```bash
gh workflow run release.yml -R SliftStudio/sliftui
```

Or run it from the repo's Actions tab. Watch the run to green, then verify:

```bash
npm view @slift/ui version
```

## 6. (Optional) GitHub Release

Cut a GitHub Release from the `vX.Y.Z` tag, using the CHANGELOG section as the notes.
