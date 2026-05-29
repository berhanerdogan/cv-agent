import { createCliRenderer } from '@opentui/core'
import { buildTui } from './tui'
import { readFile } from './lib/files'
import { openCode } from './lib/opencode-sdk'
import { execSync } from 'child_process'

const main = async () => {
	const rendererPromise = createCliRenderer({ exitOnCtrlC: true })
	const dataPromise = readFile()
	const serverPromise = openCode.ensureStarted()

	const renderer = await rendererPromise
	const data = await dataPromise
	await serverPromise

  process.on('SIGHUP', () => {
    try {
      execSync('pkill -f "opencode serve"')
    } catch {}
    renderer.destroy()
    process.exit(0)
  })

	await buildTui(renderer, data)
	renderer.start()


}
main()
