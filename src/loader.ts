// import { exit, stdin, stdout } from 'node:process'
// import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

// import { Colors, Symbols, Unicode } from './lib/consts'

// interface Loader {
//   /** Starts the loader. */
//   start: (text: string) => void
//   /** Ends the loader. */
//   end: (text: string) => void
// }

// /** The `loader` function enables the creation of a loading icon, providing visual feedback to users during ongoing processes. */
// export function loader(onCancel?: () => void): Loader {
//   const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')
//   let initialText: string[]

//   let currentLoad = 0
//   let dots = ''

//   let interval: NodeJS.Timeout | null = null

//   const listener = (data: Buffer) => {
//     const key = data.toString()
//     const isCancel = key === Unicode.ControlC || key === Unicode.Esc

//     if (isCancel) {
//       moveCursor(stdout, 0, initialText.length * -1)
//       cursorTo(stdout, 0)
//       clearScreenDown(stdout)
//       stdout.write(`${Colors.FgRed + Symbols.Error} ${Colors.Reset + Unicode.ShowCursor}`)
//       if (onCancel) {
//         stdin.removeListener('data', listener)
//         stdin.pause()
//         onCancel()
//       } else {
//         stdout.write(`${Colors.FgRed}Operation cancelled${Colors.Reset}\n`)
//         process.exit(0)
//       }
//       process.exit(0)
//     }
//   }

//   const start = (text: string) => {
//     if (initialText) throw new Error('Loader has already started')

//     stdin.resume()
//     stdin.setEncoding('utf-8')
//     stdin.setRawMode(true)

//     stdin.on('data', listener)

//     const splitedText = `${text}   `.match(regex) ?? ['']
//     initialText = [...splitedText]

//     if (splitedText.length > stdout.rows) {
//       stdout.write(`You need at least ${splitedText.length} rows to continue\n`)
//       exit(1)
//     }

//     const textUpdate = () => {
//       moveCursor(stdout, 0, splitedText.length * -1)
//       cursorTo(stdout, 0)
//       clearScreenDown(stdout)

//       stdout.write(`${splitedText.map((split, index) => `${Colors.FgBlue}${index === 0 ? Symbols.Load[currentLoad] : index + 1 === splitedText.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Bright + split.trim() + Colors.Reset}`).join('\n') + Colors.Bright + dots + Colors.Reset}\n`)
//     }

//     stdout.write(`${Unicode.HideCursor + splitedText.map((split, index) => `${Colors.FgBlue}${index === 0 ? Symbols.Load[currentLoad] : index + 1 === splitedText.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Bright + split.trim() + Colors.Reset}`).join('\n') + Colors.Bright + dots + Colors.Reset}\n`)

//     interval = setInterval(() => {
//       if (currentLoad + 1 === Symbols.Load.length) currentLoad = 0
//       else currentLoad++
//       if (currentLoad % 5 === 0) {
//         if (dots.length === 3) dots = ''
//         else dots += '.'
//       }
//       textUpdate()
//     }, 100)
//   }

//   const end = (text: string) => {
//     if (!initialText) throw new Error("Loader hasn't started yet")

//     stdin.removeListener('data', listener)
//     stdin.pause()
//     if (!interval) return
//     clearInterval(interval)

//     const splitedText = text.match(regex) ?? ['']

//     moveCursor(stdout, 0, initialText.length * -1)
//     cursorTo(stdout, 0)
//     clearScreenDown(stdout)

//     stdout.write(`${Unicode.ShowCursor + splitedText.map((txt, index) => `${Colors.FgGreen}${index === 0 ? Symbols.Answered : Symbols.LineVertical}${Colors.Reset} ${Colors.Bright + txt + Colors.Reset}`).join('\n')}\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset}\n`)
//   }

//   return {
//     start,
//     end,
//   }
// }

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
