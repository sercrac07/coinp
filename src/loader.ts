import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface Loader {
  /** Starts the loader. */
  start: (text: string) => void
  /** Stops the loader */
  stop: (text: string) => void
}

/** The `loader` function enables the creation of a loading icon, providing visual feedback to users during ongoing processes. */
export function loader(onCancel?: () => void): Loader {
  const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')
  let initialText: string[] = []

  let currentLoad = 0
  let dots = ''

  let interval: NodeJS.Timeout | null = null

  const listener = (data: Buffer) => {
    const key = data.toString()
    const isCancel = key === Unicode.ControlC || key === Unicode.Esc

    if (isCancel) {
      moveCursor(stdout, 0, initialText.length * -1)
      cursorTo(stdout, 0)
      clearScreenDown(stdout)
      stdout.write(`${Colors.FgRed + Symbols.Error} ${Colors.Reset + Unicode.ShowCursor}`)
      if (onCancel) {
        stdin.removeListener('data', listener)
        stdin.pause()
        onCancel()
      } else {
        stdout.write(`${Colors.FgRed}Operation cancelled${Colors.Reset}\n`)
        process.exit(0)
      }
      process.exit(0)
    }
  }

  const start = (text: string) => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    stdin.on('data', listener)

    const splitedText = `${text}   `.match(regex) ?? ['']
    initialText = [...splitedText]

    if (splitedText.length > stdout.rows) {
      stdout.write(`You need at least ${splitedText.length} rows to continue\n`)
      exit(1)
    }

    const textUpdate = () => {
      moveCursor(stdout, 0, splitedText.length * -1)
      cursorTo(stdout, 0)
      clearScreenDown(stdout)

      stdout.write(`${splitedText.map((split, index) => `${Colors.FgBlue}${index === 0 ? Symbols.Load[currentLoad] : index + 1 === splitedText.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Bright + split.trim() + Colors.Reset}`).join('\n') + Colors.Bright + dots + Colors.Reset}\n`)
    }

    stdout.write(`${Unicode.HideCursor + splitedText.map((split, index) => `${Colors.FgBlue}${index === 0 ? Symbols.Load[currentLoad] : index + 1 === splitedText.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Bright + split.trim() + Colors.Reset}`).join('\n') + Colors.Bright + dots + Colors.Reset}\n`)

    interval = setInterval(() => {
      if (currentLoad + 1 === Symbols.Load.length) currentLoad = 0
      else currentLoad++
      if (currentLoad % 5 === 0) {
        if (dots.length === 3) dots = ''
        else dots += '.'
      }
      textUpdate()
    }, 100)
  }

  const stop = (text: string) => {
    stdin.removeListener('data', listener)
    stdin.pause()
    if (!interval) return
    clearInterval(interval)

    moveCursor(stdout, 0, initialText.length * -1)
    cursorTo(stdout, 0)
    clearScreenDown(stdout)

    stdout.write(`${Colors.FgGreen + Symbols.Answered + Colors.Reset} ${Colors.Bright + text + Unicode.ShowCursor}\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset}\n`)
  }

  return {
    start,
    stop,
  }
}
