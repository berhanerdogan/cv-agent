import {
  BoxRenderable,
  TextRenderable,
  SelectRenderable,
  SelectRenderableEvents,
  type CliRenderer,
} from '@opentui/core'
import theme from '../../theme'

const STATUS_OPTIONS = [
  { name: "pending", description: "pending" },
  { name: "applied", description: "applied" },
  { name: "interview", description: "interview" },
  { name: "offer", description: "offer" },
  { name: "rejected", description: "rejected" },
]

let dialog: BoxRenderable
let select: SelectRenderable
let currentCallback: ((status: string) => void) | null = null

const onItemSelected = () => {
  const selected = select.getSelectedOption()
  if (selected && currentCallback) {
    currentCallback(selected.name)
  }
  dialog.visible = false
}

export const showStatusSelect = (renderer: CliRenderer, currentStatus: string, onSelect: (status: string) => void) => {
  if (!dialog) return

  const idx = STATUS_OPTIONS.findIndex(o => o.name === currentStatus)
  select.setSelectedIndex(idx >= 0 ? idx : 0)
  currentCallback = onSelect

  dialog.visible = true
  select.focus()
}

export const hideStatusSelect = () => {
  if (dialog) dialog.visible = false
}

export const isStatusSelectVisible = () => {
  return dialog?.visible ?? false
}

export const buildStatusSelect = (renderer: CliRenderer) => {
  dialog = new BoxRenderable(renderer, {
    id: "status-dialog",
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "auto",
    flexDirection: "column",
    gap: 1,
    padding: 1,
    backgroundColor: theme.bgAlt,
    border: true,
    borderColor: theme.border,
    visible: false,
  })

  const title = new TextRenderable(renderer, {
    id: "status-dialog-title",
    content: " Select Status",
    fg: theme.blue,
  })
  dialog.add(title)

  select = new SelectRenderable(renderer, {
    id: "status-dialog-select",
    width: "100%",
    height: STATUS_OPTIONS.length + 2,
    options: STATUS_OPTIONS,
    selectedIndex: 0,
    backgroundColor: theme.bgAlt,
    textColor: theme.dim,
    focusedBackgroundColor: theme.light,
    focusedTextColor: theme.text,
    selectedBackgroundColor: theme.bgPanel,
    selectedTextColor: theme.blue,
    showDescription: false,
  })
  select.on(SelectRenderableEvents.ITEM_SELECTED, onItemSelected)
  dialog.add(select)

  return dialog
}
