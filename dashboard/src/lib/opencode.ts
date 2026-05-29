import { spawn } from "child_process"
import { appendFileSync } from "fs"

const DEFAULT_TIMEOUT = 120_000

export function run(input: string, timeout?: number): Promise<string> {
  const args = ["run", "/cv-agent " + input.trim()]
  const ttl = timeout ?? DEFAULT_TIMEOUT
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      proc.kill()
      reject(new Error(`opencode timed out after ${ttl}ms`))
    }, ttl)
    const proc = spawn("opencode", args, {
      stdio: ["ignore", "pipe", "pipe"],
    })
    let output = ""
    proc.stdout.on("data", (d) => {
      appendFileSync("/tmp/oc.log", d)
      output += d.toString()
    })
    proc.stderr.on("data", (d) => {
      appendFileSync("/tmp/oc.log", "[stderr] " + d.toString())
    })
    proc.on("close", (code) => {
      appendFileSync("/tmp/oc.log", `exit code: ${code}\n`)
      clearTimeout(timer)
      if (code === 0) resolve(output)
      else reject(new Error(`exit code ${code}`))
    })
    proc.on("error", (err) => {
      clearTimeout(timer)
      reject(err)
    })
  })
}
