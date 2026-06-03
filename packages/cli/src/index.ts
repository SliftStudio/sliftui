import { parseArgs } from 'node:util'
import { existsSync, mkdirSync, readFileSync, copyFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'

const __dirname = dirname(fileURLToPath(import.meta.url))

// From dist/index.js, the registry ships as a sibling at ../registry.
const REGISTRY_DIR = resolve(__dirname, '..', 'registry')
const REGISTRY_FILE = join(REGISTRY_DIR, 'registry.json')

const MARK = pc.cyan('◆')
const WORDMARK = `${MARK} ${pc.bold('slift')}`

const SVELTE_REQUIREMENT = 'Svelte >= 5.16'

interface RegistryComponent {
	name: string
	description: string
	files: string[]
	dir: string
}

interface Registry {
	components: Record<string, RegistryComponent>
}

function getVersion(): string {
	try {
		// package.json sits at the package root, a sibling of dist/.
		const pkgPath = resolve(__dirname, '..', 'package.json')
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
		return pkg.version ?? '0.0.0'
	} catch {
		return '0.0.0'
	}
}

function loadRegistry(): Registry {
	try {
		return JSON.parse(readFileSync(REGISTRY_FILE, 'utf8')) as Registry
	} catch {
		fail(`Could not read the component registry at ${pc.dim(REGISTRY_FILE)}.`)
	}
}

/** Normalize "NumberRoll", "number-roll", "NUMBERROLL" -> "numberroll" for lookup. */
function normalizeKey(value: string): string {
	return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function resolveComponent(
	registry: Registry,
	input: string,
): { id: string; component: RegistryComponent } | null {
	const target = normalizeKey(input)
	for (const [id, component] of Object.entries(registry.components)) {
		if (
			normalizeKey(id) === target ||
			normalizeKey(component.name) === target
		) {
			return { id, component }
		}
	}
	return null
}

function fail(message: string): never {
	console.error(`${pc.red('✖')} ${message}`)
	process.exit(1)
}

function printHelp(): void {
	const lines = [
		'',
		`  ${WORDMARK} ${pc.dim('the Slift command line')}`,
		'',
		`  ${pc.bold('Usage')}`,
		`    ${pc.cyan('slift')} ${pc.dim('<command> [options]')}`,
		'',
		`  ${pc.bold('Commands')}`,
		`    ${pc.cyan('add')} ${pc.dim('<component...>')}   Copy component source files into your project`,
		`    ${pc.cyan('list')}                 List every available component`,
		'',
		`  ${pc.bold('Options')}`,
		`    ${pc.cyan('--cwd')} ${pc.dim('<path>')}         Project root (default: current directory)`,
		`    ${pc.cyan('--dir')} ${pc.dim('<path>')}         Destination dir, relative to cwd`,
		`    ${pc.cyan('--overwrite')}          Overwrite existing files`,
		`    ${pc.cyan('--help, -h')}           Show this help`,
		`    ${pc.cyan('--version, -v')}        Show the version`,
		'',
		`  ${pc.bold('Examples')}`,
		`    ${pc.dim('$')} npx slift add number-roll`,
		`    ${pc.dim('$')} npx slift add NumberRoll --overwrite`,
		`    ${pc.dim('$')} npx slift list`,
		'',
		`  ${pc.dim('Components are copied into your project, so you own the code.')}`,
		`  ${pc.dim('Prefer a dependency? Use the @slift/ui package instead.')}`,
		'',
	]
	console.log(lines.join('\n'))
}

function printVersion(): void {
	console.log(getVersion())
}

function listComponents(): void {
	const registry = loadRegistry()
	const entries = Object.entries(registry.components)

	console.log('')
	console.log(`  ${WORDMARK} ${pc.dim('components')}`)
	console.log('')

	if (entries.length === 0) {
		console.log(`  ${pc.dim('No components are available yet.')}`)
		console.log('')
		return
	}

	for (const [id, component] of entries) {
		console.log(`  ${pc.cyan(id)} ${pc.dim(`(${component.name})`)}`)
		console.log(`    ${component.description}`)
		console.log('')
	}

	console.log(`  ${pc.dim('Add one with')} ${pc.cyan('slift add <component>')}`)
	console.log('')
}

interface AddResult {
	written: string[]
	skipped: string[]
}

function addComponents(
	positionals: string[],
	values: Record<string, unknown>,
): void {
	if (positionals.length === 0) {
		fail(
			`No component specified. Try ${pc.cyan('slift add number-roll')} or ${pc.cyan('slift list')}.`,
		)
	}

	const registry = loadRegistry()

	const cwd = resolve(
		typeof values.cwd === 'string' ? values.cwd : process.cwd(),
	)
	const overwrite = values.overwrite === true
	const dirOverride = typeof values.dir === 'string' ? values.dir : undefined

	// Resolve all requested components first; bail before writing anything if any
	// name is unknown.
	const resolved = positionals.map((name) => {
		const match = resolveComponent(registry, name)
		if (!match) {
			const known = Object.keys(registry.components)
				.map((id) => pc.cyan(id))
				.join(', ')
			fail(
				`Unknown component ${pc.bold(name)}. Available: ${known}.\n  See ${pc.cyan('slift list')} for details.`,
			)
		}
		return match
	})

	const result: AddResult = { written: [], skipped: [] }

	const libDir = join(cwd, 'src', 'lib')
	const hasLib = existsSync(libDir)

	for (const { component } of resolved) {
		// Destination resolution:
		//   --dir overrides everything (relative to cwd)
		//   else src/lib/<component.dir> when src/lib exists
		//   else fall back to ./<file> at cwd with a warning
		let destDir: string
		if (dirOverride) {
			destDir = resolve(cwd, dirOverride)
		} else if (hasLib) {
			destDir = join(libDir, component.dir)
		} else {
			destDir = cwd
			console.log(
				`${pc.yellow('!')} ${pc.dim(
					`src/lib not found, writing to the current directory instead.`,
				)}`,
			)
		}

		for (const file of component.files) {
			const source = join(REGISTRY_DIR, file)
			if (!existsSync(source)) {
				fail(`Registry file missing: ${pc.dim(source)}`)
			}

			const target = join(destDir, file)

			if (existsSync(target) && !overwrite) {
				result.skipped.push(target)
				console.log(
					`${pc.yellow('!')} ${relativeTo(cwd, target)} already exists, skipped ${pc.dim(
						'(use --overwrite)',
					)}`,
				)
				continue
			}

			mkdirSync(dirname(target), { recursive: true })
			copyFileSync(source, target)
			result.written.push(target)
			console.log(`${pc.green('✔')} ${relativeTo(cwd, target)}`)
		}
	}

	printAddSummary(cwd, result)
}

function relativeTo(cwd: string, target: string): string {
	// Cross-platform, and falls back to the absolute path if `target` sits
	// outside `cwd` (e.g. a custom --dir above the project root).
	const rel = relative(cwd, target)
	return rel && !rel.startsWith('..') ? rel : target
}

function printAddSummary(cwd: string, result: AddResult): void {
	console.log('')
	if (result.written.length > 0) {
		const noun = result.written.length === 1 ? 'file' : 'files'
		console.log(
			`  ${MARK} Wrote ${pc.bold(String(result.written.length))} ${noun}:`,
		)
		for (const file of result.written) {
			console.log(`    ${pc.dim(relativeTo(cwd, file))}`)
		}
		console.log('')
		console.log(
			`  ${pc.dim(`Zero runtime deps. Needs ${SVELTE_REQUIREMENT}.`)}`,
		)
	} else if (result.skipped.length > 0) {
		console.log(
			`  ${pc.dim('Nothing written, every file already existed. Pass')} ${pc.cyan('--overwrite')} ${pc.dim('to replace them.')}`,
		)
	}
	console.log('')
}

function main(): void {
	const argv = process.argv.slice(2)

	// Pull global flags from the raw argv so they work with or without a command.
	if (argv.includes('--help') || argv.includes('-h')) {
		printHelp()
		return
	}
	if (argv.includes('--version') || argv.includes('-v')) {
		printVersion()
		return
	}
	if (argv.length === 0) {
		printHelp()
		return
	}

	const [command, ...rest] = argv

	switch (command) {
		case 'add': {
			const { values, positionals } = parseArgs({
				args: rest,
				allowPositionals: true,
				options: {
					cwd: { type: 'string' },
					dir: { type: 'string' },
					overwrite: { type: 'boolean', default: false },
				},
			})
			addComponents(positionals, values)
			return
		}
		case 'list': {
			listComponents()
			return
		}
		default: {
			fail(
				`Unknown command ${pc.bold(command)}. Run ${pc.cyan('slift --help')} to see what's available.`,
			)
		}
	}
}

try {
	main()
} catch (error) {
	const message = error instanceof Error ? error.message : String(error)
	fail(message)
}
