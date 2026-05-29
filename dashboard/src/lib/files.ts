import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

const filePath = path.join(__dirname, '..', '..', '..', 'data', 'applications.json')

export const readFile = async () => {
	try {
		const data = await fs.promises.readFile(filePath, 'utf8')
		const jsonData = JSON.parse(data)
		return jsonData
	} catch (err) {
		return null
	}
}

export const openLink = (url: string) => {
	const cmd = process.platform === 'darwin' ? 'open' :
		process.platform === 'win32' ? 'start' : 'xdg-open'
	exec(`${cmd} "${url}"`)
}
