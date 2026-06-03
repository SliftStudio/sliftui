# Publishing

This repo publishes one package: **`@slift/ui`**. It is scoped under the `@slift` org, which you own, so it is guaranteed publishable (scoped names skip npm's similarity filter).

Publishing keeps the `@slift` org active, which matters: npm can reclaim an org that never publishes anything.

## One-time setup

Create an npm account and enable 2FA (Settings, Two-Factor Authentication). You already own the `@slift` org, so nothing else is needed.

## Publish

```bash
npm login            # prompts for 2FA
pnpm install
pnpm build           # svelte-package builds dist/
pnpm publish         # publishes @slift/ui (publishConfig already sets public access)
```

`pnpm publish` will prompt for your OTP. To preview exactly what ships first, run `npm pack --dry-run`.

## Provenance (optional)

A local publish cannot attach provenance. To get the "built by this repo" attestation, publish from GitHub Actions instead: add a granular npm automation token as the `NPM_TOKEN` repo secret, then run the **Release** workflow. It builds and publishes with `--provenance`.

## Versioning

Starts at `0.0.x`. While on `0.x`, every release is allowed to break, so the API stays free to change. Move to `1.0.0` when you want to promise stability.
