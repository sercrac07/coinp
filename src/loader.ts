import { exit, stdin, stdout } from "node:process"
import { clearScreenDown, moveCursor, cursorTo, clearLine } from "node:readline"

import { Colors, Symbols, Unicode } from "./lib/consts"
import { clearString, splitHeight } from "./lib/utils"

interface Loader {
  /** Starts the loader. */
  start: (text: string) => void
  /** Ends the loader. */
  end: (text: string) => void
}

/**
 * The `loader` function enables the creation of a loading icon, providing visual feedback to users during ongoing processes.
 *
 * [API Reference](https://github.com/sercrac07/coinp?tab=readme-ov-file#coinploader)
 */
export function loader(): Loader {
  let thisText = ""
  let currentLoad = 0
  let lastJump = 0
  let interval: NodeJS.Timeout | null = null

  const updateConsole = (type: "intro" | "input" | "end" = "input") => {
    const symbol = type === "end" ? Symbols.Answered : Symbols.Load[currentLoad]
    const color = type === "end" ? Colors.FgGreen : Colors.FgBlue
    const extra = type === "end" ? Unicode.ShowCursor : Unicode.HideCursor

    const showMessage = `${extra + color + symbol + Colors.Reset} ${Colors.Bright + thisText + Colors.Reset}`
    const messageLength = splitHeight(clearString(showMessage), showMessage, stdout.columns).normal.length

    if (type !== "intro") {
      // Clean the console depending on the message line height
      if (lastJump !== 0) {
        moveCursor(stdout, 0, lastJump * -1)
        cursorTo(stdout, 0)
        clearScreenDown(stdout)
      } else {
        cursorTo(stdout, 0)
        clearLine(stdout, 0)
      }
    }

    stdout.write(showMessage)
    lastJump = messageLength - 1
  }

  const listener = (data: Buffer) => {
    const key = data.toString()
    const isCancel = key === Unicode.ControlC || key === Unicode.Esc

    if (isCancel) {
      stdout.write(Unicode.ShowCursor)
      stdin.removeListener("data", listener)
      exit()
    }
  }

  const start: Loader["start"] = text => {
    thisText = text

    stdin.resume()
    stdin.setEncoding("utf-8")
    stdin.setRawMode(true)

    stdin.on("data", listener)

    updateConsole("intro")
    interval = setInterval(() => {
      if (currentLoad + 1 === Symbols.Load.length) currentLoad = 0
      else currentLoad++
      updateConsole()
    }, 100)
  }

  const end: Loader["end"] = text => {
    stdin.removeListener("data", listener)
    stdin.pause()
    if (interval) clearInterval(interval)
    thisText = text
    updateConsole("end")
    stdout.write("\n")
  }

  return {
    start,
    end
  }
}
