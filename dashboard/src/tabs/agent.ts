import {
  BoxRenderable,
  TextareaRenderable,
  ScrollBoxRenderable,
  TextRenderable,
  type CliRenderer
} from '@opentui/core'
import { SpinnerRenderable } from "opentui-spinner"
import theme from '../../theme'
import { openCode } from '../lib/opencode-sdk'

const addMessage = (log: ScrollBoxRenderable, role: string, content: string) => {
  const header = new TextRenderable(log.ctx, {
    id: `hdr-${Date.now()}-${Math.random()}`,
    content: ` ${role === 'user' ? 'You' : 'CV Agent'}`,
    fg: role === 'user' ? theme.blue : theme.red,
  })
  const body = new TextRenderable(log.ctx, {
    id: `msg-${Date.now()}-${Math.random()}`,
    content: ` ${content}`,
    fg: theme.text,
    wrapMode: 'word',
  })
  log.add(header)
  log.add(body)
}

const buildContent = (renderer: CliRenderer) => {

  const spinner = new SpinnerRenderable(renderer, {
    name: "noise",
  });

  const panelA = new BoxRenderable(renderer, {
    id: 'panel-a',
    border: true,
    borderStyle: 'rounded',
    borderColor: theme.border,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    padding: 1,
    gap: 1
  })

  const chatLog = new ScrollBoxRenderable(renderer, {
    id: 'chat-log',
    flexGrow: 1,
    width: '100%',
    scrollY: true,
    stickyStart: 'bottom',
  })

  const input = new TextareaRenderable(renderer, {
    id: 'input',
    placeholder: 'paste link or job description (Ctrl+Enter to submit)',
    width: '100%',
    height: 6,
    backgroundColor: theme.bgAlt,
    textColor: theme.text,
    focusedBackgroundColor: theme.bgPanel,
    
    onSubmit: async () => {
      const text = input.plainText.trim()
      if (!text) return
      input.clear()
      addMessage(chatLog, 'user', text)
      spinner.visible = true
      try {
        const response = await openCode.run(text)
        addMessage(chatLog, 'agent', response.trim())
      } catch (e) {
        addMessage(chatLog, 'agent', `Error: ${e}`)
      } finally {
        spinner.visible = false
      }
    },
    keyBindings: [{ name: "return", ctrl: true, action: "submit" }],
  })

  spinner.visible = false
  panelA.add(chatLog)
  panelA.add(input)
  panelA.add(spinner)
 

  return { panelA }
}

export const buildAgent = (renderer: CliRenderer) => {
  const { panelA } = buildContent(renderer)

  const container = new BoxRenderable(renderer, {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  })

  container.add(panelA)

  return container
}
