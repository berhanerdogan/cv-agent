import * as path from 'path'
import * as fs from 'fs'
import type { CliRenderer, KeyEvent } from '@opentui/core'
import { appState } from '../components/state'
import { showDialog } from '../components/dialog'
import { showStatusSelect, hideStatusSelect, isStatusSelectVisible } from '../components/status-select'
import { openLink } from './files'

const DATA_PATH = path.join(__dirname, '../../../data/applications.json')

export const setupKeyboardEvents = (renderer: CliRenderer, refresh: () => Promise<void>) => {
	renderer.keyInput.on('keypress', async (key: KeyEvent) => {
		if (key.name === 'left' || key.name === 'right') {
			const tabSelect: any = renderer.root.findDescendantById('tabs')
			if (!tabSelect) return
			if (key.name === 'left') tabSelect.moveLeft()
			if (key.name === 'right') tabSelect.moveRight()
			return
		}

		const { rows, table } = appState
		if (!table) return

		if (key.name === 'down' && !isStatusSelectVisible()) {
			appState.focusedIndex = Math.min(appState.focusedIndex + 1, rows.length - 1)
			rows[appState.focusedIndex]?.focus()
			table.scrollChildIntoView(rows[appState.focusedIndex]?.id ?? '')
			return
		}
		if (key.name === 'up' && !isStatusSelectVisible()) {
			appState.focusedIndex = Math.max(appState.focusedIndex - 1, 0)
			rows[appState.focusedIndex]?.focus()
			table.scrollChildIntoView(rows[appState.focusedIndex]?.id ?? '')
			return
		}
		if (key.name === 'escape') {
			if (isStatusSelectVisible()) {
				hideStatusSelect()
				return
			}
			rows[appState.focusedIndex]?.blur()
			appState.focusedIndex = -1
			return
		}
		if (key.ctrl && key.name === 'o') {
			if (appState.focusedIndex < 0) return
			const row = rows[appState.focusedIndex]
			if (!row) return
			const itemId = row.id.replace('row-', '')
			const freshData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
			const entry = freshData.find((e: any) => e.id === itemId)
			if (entry) openLink(entry.link)
			return
		}
		if (key.ctrl && key.name === 'p') {
			if (appState.focusedIndex < 0) return
			const row = rows[appState.focusedIndex]
			if (!row) return
			const itemId = row.id.replace('row-', '')
			const freshData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
			const entry = freshData.find((e: any) => e.id === itemId)
			if (entry) openLink(path.join(__dirname, '..', '..', '..', entry.path))
			return
		}
		if (key.ctrl && key.name === 's') {
			if (appState.focusedIndex < 0) return
			const row = rows[appState.focusedIndex]
			if (!row) return
			const itemId = row.id.replace('row-', '')
			const statusText: any = renderer.root.findDescendantById(`status-${itemId}`)
			const st = statusText?.content
			const currentStatus = st?.chunks?.map((c: any) => c.text).join('')?.trim() ?? ''
			showStatusSelect(renderer, currentStatus, async (newStatus) => {
				const freshData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
				const entry = freshData.find((e: any) => e.id === itemId)
				if (entry) {
					entry.status = newStatus
					fs.writeFileSync(DATA_PATH, JSON.stringify(freshData, null, 2))
				}
				await refresh()
			})
			return
		}
		if (key.ctrl && key.name === 'r') {
			await refresh()
			return
		}
		if (key.name === 'c') {
			showDialog()
			return
		}
	})
}
