import theme from '../../theme'
import type { CliRenderer } from '@opentui/core'
import { BoxRenderable, TextRenderable } from '@opentui/core'

export const buildFooter = (renderer: CliRenderer) => {
	const bar = new BoxRenderable(renderer, {
		id: 'footer',
		height: 1,
		flexDirection: "row",
		backgroundColor: theme.bgAlt,
		paddingLeft: 1,
		paddingRight: 1
	})
	bar.add(new TextRenderable(renderer, {
		id: 'status-text',
		content: 'press <c> to open controls',
		fg: theme.dim,
	}))
	return bar
}
