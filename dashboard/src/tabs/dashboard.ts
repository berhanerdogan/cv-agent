import theme from '../../theme'
import type { CliRenderer } from '@opentui/core'
import { BoxRenderable, TextRenderable, ScrollBoxRenderable, RenderableEvents } from '@opentui/core'
import { truncate } from '../utils/string'

const buildContent = async (renderer: CliRenderer, data: any[]) => {

  const rows: BoxRenderable[] = []

	const table = new ScrollBoxRenderable(renderer, {
		id: 'table',
		flexDirection: 'row',
		gap: 0,
		width: '100%',
	})

	const header = new BoxRenderable(renderer, {
		id: 'header-row',
		flexDirection: 'row',
		gap: 0,
		width: '100%',
		backgroundColor: theme.bgAlt
	})
	header.add(new TextRenderable(renderer, { id: 'h-name', content: ' NAME', fg: theme.blue, width: '40%' }))
	header.add(new TextRenderable(renderer, { id: 'h-link', content: ' LINK', fg: theme.blue, width: '45%' }))
	header.add(new TextRenderable(renderer, { id: 'h-status', content: ' STATUS', fg: theme.blue, width: '15%' }))
	table.add(header)

	data.forEach((row: any) => {
		const statusColors: Record<string, string> = {
			applied: theme.dim,
			interview: theme.blue,
			pending: theme.yellow,
			rejected: theme.red,
			offer: theme.green
		}
		const rowBox = new BoxRenderable(renderer, {
			id: `row-${row.id}`,
			flexDirection: 'row',
			gap: 0,
			width: '100%',
			focusable: true,
		})

		rowBox.on(RenderableEvents.FOCUSED, () => {
			rowBox.backgroundColor = theme.light
		})

		rowBox.on(RenderableEvents.BLURRED, () => {
			rowBox.backgroundColor = undefined
		})

		rowBox.add(new TextRenderable(renderer, { id: `name-${row.id}`, content: ` ${row.name}`, width: '40%' }))
		rowBox.add(new TextRenderable(renderer, { id: `link-${row.id}`, content: ` ${truncate(row.link, 30)}`, fg: theme.dim, width: '45%' }))
		rowBox.add(new TextRenderable(renderer, { id: `status-${row.id}`, content: ` ${row.status}`, fg: statusColors[row.status] ?? theme.dim, width: '15%' }))
		table.add(rowBox)
		rows.push(rowBox)
	})

	return { table, rows }
}

export const buildDashboard = async (renderer: CliRenderer, data: any[]) => {
	const panel = new BoxRenderable(renderer, {
		id: 'panel-a',
		border: true,
		borderStyle: 'rounded',
		borderColor: theme.border,
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		padding: 1,
	})
	const { table, rows } = await buildContent(renderer, data)
	panel.add(table)
	return { panel, rows, table }
}
