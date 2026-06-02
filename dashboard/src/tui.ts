import theme from '../theme'
import type { CliRenderer } from '@opentui/core'
import { BoxRenderable } from '@opentui/core'
import { buildHeader } from './components/header'
import { buildTabs } from './components/tabSelect' 
import { buildFooter } from './components/footer'
import { buildContentArea } from './components/content-area'
import { setupKeyboardEvents } from './lib/keyboard'

  

export const buildTui = async (renderer: CliRenderer) => {
	const main = new BoxRenderable(renderer, {
		id: 'main',
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		backgroundColor: theme.bg
	})
	const { content, refresh } = await buildContentArea(renderer)
	main.add(buildHeader(renderer))
  main.add(buildTabs(renderer, refresh))
	main.add(content)
	main.add(buildFooter(renderer))
	renderer.root.add(main)

  setupKeyboardEvents(renderer, refresh)
}
