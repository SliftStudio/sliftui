# slift

The command line for [Slift](https://slift.co). One way into the Slift toolkit, and built to grow.

Its first command, `add`, scaffolds [Slift UI](https://slift.co) components into your project, shadcn-style: instead of installing a runtime dependency, it **copies the component source directly into your project**, so you own the `.svelte` code and can edit it however you like. More commands will land over time.

## Usage

No install needed, run it with `npx`:

```sh
# Add a component to your project
npx slift add number-roll

# List every available component
npx slift list
```

## How `add` works

```sh
slift add <component...> [options]
```

For each component name, `slift` looks it up in its registry, resolves the full file list (a component and everything it depends on), and copies those files into your project.

- **Destination.** By default files land in `src/lib/components/` relative to the current directory. If `src/lib` does not exist, files are written to the current directory and you get a warning.
- **Naming.** Component names are case-insensitive and accepted in either form: `number-roll` or `NumberRoll`.
- **Safety.** If a target file already exists it is skipped, so you never clobber local edits. Pass `--overwrite` to replace it.

### Options

| Option            | Description                               |
| ----------------- | ----------------------------------------- |
| `--cwd <path>`    | Project root (default: current directory) |
| `--dir <path>`    | Destination directory, relative to `cwd`  |
| `--overwrite`     | Overwrite files that already exist        |
| `--help`, `-h`    | Show help                                 |
| `--version`, `-v` | Show the version                          |

## You own the code

Copied components have **zero runtime dependencies** and need **Svelte >= 5.16**. They live in your repo, under your version control, with no `@slift/ui` import in sight. Tweak them freely.

## Prefer a normal dependency?

If you would rather install Slift UI as a package and import from it, use [`@slift/ui`](https://slift.co). The `slift` CLI and `@slift/ui` reach the same components, so pick whichever fits your project.
