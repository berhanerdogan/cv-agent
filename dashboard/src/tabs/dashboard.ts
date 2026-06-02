import theme from '../../theme'
import type { CliRenderer } from '@opentui/core'
import { BoxRenderable, TextRenderable, ScrollBoxRenderable, RenderableEvents } from '@opentui/core'

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
		gap: 2,
		width: '100%',
		backgroundColor: theme.bgAlt
	})
	header.add(new TextRenderable(renderer, { id: 'h-name', content: ' NAME', fg: theme.blue, flexGrow: 40, flexBasis: 0 }))
	header.add(new TextRenderable(renderer, { id: 'h-company', content: ' COMPANY', fg: theme.blue, flexGrow: 45, flexBasis: 0 }))
	header.add(new TextRenderable(renderer, { id: 'h-status', content: ' STATUS', fg: theme.blue, flexGrow: 15, flexBasis: 0 }))
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
		gap: 2,
		width: '100%',
		focusable: true,
		})

		rowBox.on(RenderableEvents.FOCUSED, () => {
			rowBox.backgroundColor = theme.light
		})

		rowBox.on(RenderableEvents.BLURRED, () => {
			rowBox.backgroundColor = undefined
		})

		rowBox.add(new TextRenderable(renderer, { id: `name-${row.id}`, content: ` ${row.name}`, wrapMode: 'none', truncate: true, flexGrow: 40, flexBasis: 0 }))
		rowBox.add(new TextRenderable(renderer, { id: `company-${row.id}`, content: ` ${row.company}`, wrapMode: 'none', truncate: true, fg: theme.dim, flexGrow: 45, flexBasis: 0 }))
		rowBox.add(new TextRenderable(renderer, { id: `status-${row.id}`, content: ` ${row.status}`, wrapMode: 'none', fg: statusColors[row.status] ?? theme.dim, flexGrow: 15, flexBasis: 0 }))
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
