import { 
  TabSelectRenderable,
  TabSelectRenderableEvents,
  type TabSelectOption,
  type CliRenderer
} from "@opentui/core"
import theme from '../../theme'
import { appState } from './state'

const tabOptions: TabSelectOption[] = [
  { name: 'Dashboard', description: 'dashboard', value: 'dashboard' },
  { name: 'Agent', description: 'agent', value: 'agent' }
]

export const buildTabs = (renderer: CliRenderer, onTabChange?: () => void) => {
  const tabSelect = new TabSelectRenderable(renderer, {
    id: "tabs",
    options: tabOptions,
    backgroundColor: theme.bgAlt,
    textColor: theme.text,
    focusedTextColor: theme.blue,
    selectedBackgroundColor: theme.bgPanel,
    selectedTextColor: theme.text,
    showScrollArrows: true,
    showUnderline: false,
    showDescription: false,
  })

  tabSelect.on(TabSelectRenderableEvents.SELECTION_CHANGED, (index: number) => {
    appState.activeTab = tabOptions[index]?.value ?? 'dashboard'
    onTabChange?.()
  })
  
  return tabSelect
}
