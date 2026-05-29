import theme from '../../theme'
import type { CliRenderer } from '@opentui/core'
import { BoxRenderable, ASCIIFontRenderable, TextRenderable } from '@opentui/core'

export const buildHeader = (renderer: CliRenderer) => {
	const header = new BoxRenderable(renderer, {
		id: 'header',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: 1,
		height: 9,
		border: true,
		borderColor: theme.border,
		borderStyle: 'rounded'
	})
	header.add(new ASCIIFontRenderable(renderer, {
		id: 'title',
		text: 'cv-agent',
		font: 'pallet',
		color: theme.blue,
		maxWidth: '100%'
	}))

	return header
}
