import type { CliRenderer } from '@opentui/core'
import { BoxRenderable, RenderableEvents } from '@opentui/core'
import { buildDashboard } from '../tabs/dashboard'
import { buildAgent } from '../tabs/agent'
import { appState } from './state'
import { buildDialog } from './dialog'
import { buildStatusSelect } from './status-select'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(__dirname, '../../../data/applications.json')

export const buildContentArea = async (renderer: CliRenderer) => {

  const content = new BoxRenderable(renderer, {
    id: 'content',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%'
  })

  const helpDialog = buildDialog(renderer)
  content.add(helpDialog)

  const statusDialog = buildStatusSelect(renderer)
  content.add(statusDialog)

  const refresh = async () => {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))

    for (const child of content.getChildren()) {
      if (child.id) content.remove(child.id)
    }
    switch (appState.activeTab) {
      case 'dashboard': {
        const { panel, rows, table } = await buildDashboard(renderer, data)
        content.add(panel)
        appState.rows = rows
        appState.table = table
        appState.focusedIndex = -1
        rows.forEach((row, i) => {
          row.on(RenderableEvents.FOCUSED, () => {
            appState.focusedIndex = i
          })
        })
        break
      }
      case 'agent': {
        const panel = buildAgent(renderer)
        content.add(panel)
        appState.rows = []
        appState.table = null
        break
      }
    }

    content.add(helpDialog)
    content.add(statusDialog)
  }

  await refresh()
  return { content, refresh }
}
