import { createOpencodeServer } from "@opencode-ai/sdk/v2/server"
import { createOpencodeClient } from "@opencode-ai/sdk/v2/client"
import type { Event, QuestionRequest } from "@opencode-ai/sdk/v2/client"

export type { QuestionRequest }
export type QuestionHandler = (request: QuestionRequest) => Promise<string[][]>

class OpenCodeService {
  private server: Awaited<ReturnType<typeof createOpencodeServer>> | null = null
  private client: ReturnType<typeof createOpencodeClient> | null = null
  private sessionID: string | null = null
  private started = false

  async ensureStarted(): Promise<void> {
    if (this.started) return
    this.server = await createOpencodeServer({ port: 0 })
    this.client = createOpencodeClient({ baseUrl: this.server.url })
    this.started = true
  }

  async run(
    input: string,
    onQuestion?: QuestionHandler,
  ): Promise<string> {
    await this.ensureStarted()
    if (!this.client) throw new Error("OpenCodeService not started")

    if (!this.sessionID) {
      const res = await this.client.session.create()
      if (!res.data?.id) throw new Error("Failed to create session")
      this.sessionID = res.data.id
    }

    const events = await this.client.event.subscribe()
    ;(async () => {
      for await (const event of events.stream) {
        const sid = getSessionID(event)
        if (sid !== undefined && sid !== this.sessionID) continue
        if (event.type === "question.asked" && onQuestion) {
          const answers = await onQuestion(event.properties)
          await this.client!.question.reply({ requestID: event.properties.id, answers })
        }
        if (event.type === "permission.asked") {
          await this.client!.permission.reply({ requestID: event.properties.id, reply: "once" })
        }
      }
    })()

    const result = await this.client.session.prompt({
      sessionID: this.sessionID,
      parts: [{ type: "text" as const, text: "/cv-agent " + input.trim() }],
    })
    if (result.error) {
      throw new Error(`Prompt failed: ${JSON.stringify(result.error)}`)
    }

    let output = ""
    if (result.data?.parts) {
      for (const part of result.data.parts) {
        if (part.type === "text" && part.text) {
          output += part.text
        }
      }
    }
    return output
  }

  async stop(): Promise<void> {
    this.server?.close()
    this.server = null
    this.client = null
    this.sessionID = null
    this.started = false
  }
}

function getSessionID(event: Event): string | undefined {
  if ("properties" in event && typeof event.properties === "object" && event.properties) {
    return (event.properties as Record<string, unknown>).sessionID as string | undefined
  }
  return undefined
}

export const openCode = new OpenCodeService()
