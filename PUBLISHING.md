# Publishing

The workspace has three publishable packages. They publish in this order because `sliftui` depends on `@slift/ui`:

1. `@slift/ui` (the library)
2. `slift` (the CLI)
3. `sliftui` (the alias)

`pnpm publish` automatically replaces the `workspace:^` dependency in `sliftui` with the real published version.

## One-time setup

1. Create an npm account and **enable 2FA** (Settings → Two-Factor Authentication). Required for publishing.
2. Create an npm **org named `slift`** (npmjs.com/org/create). This claims the `@slift` scope. If `slift` is taken, use `@slift-ui` or `@sliftui` and update the package names + this file.
3. Decide how you publish: locally (simple) or via GitHub Actions with provenance (recommended once it is rolling).

## Option A — publish locally (simplest for the first release)

```bash
npm login                 # authenticate (2FA prompt)
pnpm install
pnpm build                # builds @slift/ui (svelte-package) + slift (tsup)

pnpm --filter @slift/ui publish --access public
pnpm --filter slift      publish --access public
pnpm --filter sliftui    publish --access public
```

Each publish will prompt for your 2FA OTP. Add `--provenance` if you are publishing from a CI with OIDC; local publishes cannot attach provenance.

## Option B — publish via GitHub Actions with provenance (recommended)

Provenance attaches a cryptographic "built by this repo + commit" attestation to each package, visible on npm. This is the strongest authenticity signal.

1. Create a **granular automation access token** on npm (Access Tokens → Generate → Granular) with publish permission for the `@slift` scope and the `slift` + `sliftui` packages. Automation tokens bypass 2FA, which is what CI needs.
2. Add it to the repo as a secret named **`NPM_TOKEN`** (Settings → Secrets and variables → Actions).
3. Bump versions, commit, then run the **Release** workflow from the Actions tab (`workflow_dispatch`). It installs, builds, and publishes all three with `--provenance`.

> Tip: once you outgrow hand-bumping versions, adopt [Changesets](https://github.com/changesets/changesets) for versioning + changelogs across the workspace.

## Versioning

Everything starts at `0.0.x`. While on `0.x`, treat every release as potentially breaking (that is what `0.x` signals), so you keep full freedom to evolve the API and the CLI. Move to `1.0.0` only when you want to promise stability.

## Reserve the brand (already covered by real packages)

No empty placeholders are needed: the `@slift` org locks the scope, and `slift` (CLI) and `sliftui` (alias) are real, useful packages under your own brand. Just enable 2FA on the account and you are protected against the realistic threats.
