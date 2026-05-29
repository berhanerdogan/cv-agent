import type { 
  BoxRenderable,
  ScrollBoxRenderable,
} from '@opentui/core'

export const appState = {
  activeTab: 'dashboard',
  focusedIndex: -1,
  rows: [] as BoxRenderable[],
  table: null as ScrollBoxRenderable | null,
}
