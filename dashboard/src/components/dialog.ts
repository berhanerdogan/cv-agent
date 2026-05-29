import {
  BoxRenderable,
  TextRenderable,
  type CliRenderer
} from '@opentui/core'

import theme from '../../theme'

let dialog: BoxRenderable
export const showDialog = () => { 
  dialog.visible = !dialog.visible
}

export const buildDialog = (renderer: CliRenderer) => {
    
    dialog = new BoxRenderable(renderer, {
    id: "dialog",
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "50%",
    flexDirection: "column",
    gap: 1,
    padding: 1,
    backgroundColor: theme.bgAlt,
    border: true,
    borderColor: theme.border,
    visible: false
  })

  dialog.add(new TextRenderable(renderer, {
    id: 'controls-title',
    content: ' Controls',
    fg: theme.blue,
  }))

  const textBox = new BoxRenderable(renderer, {
    id: 'textBox',
    flexDirection: 'row',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  })

  textBox.add(new TextRenderable(renderer, {
    id: 'status-text',
    content: [
      '\u2190\u2192\u2191\u2193: navigate',
      'ctrl+o: open link',
      'ctrl+p: open pdf',
      'ctrl+s: change status',
      'ctrl+r: refresh',
      'escape: unfocus',
      '------------------------',
      'ctrl+c: exit',
      'c: close this dialog',
      '',
      '',
      '* To use the agent paste a URL or job description, then press Ctrl+Enter',
          
    ].join('\n'),
    fg: theme.dim,
  }))

  dialog.add(textBox)

  return dialog
}
