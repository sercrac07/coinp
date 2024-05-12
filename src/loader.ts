import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo, clearLine } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'
import { sumAllNumbers } from './lib/arrays'

interface Loader {
  start: () => void
  next: (text: string) => void
  end: (text: string) => void
}

/**
 * The `loader` function enables the creation of a loading icon, providing visual feedback to users during ongoing processes.
 *
 * ```javascript
 * const downloadLoader = loader('Fetching data', 'Downloading data', 'Executing data')
 * downloadLoader.start()
 * // Some stuff...
 * downloadLoader.next('Data obtained correctly')
 * // Some stuff...
 * downloadLoader.next('Data downloaded successfully')
 * // Some stuff...
 * downloadLoader.end('Ended working with data')
 * ```
 */
export function loader(...step: string[]): Loader {
  const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')

  let currentLoad = 0
  let dots = ''
  let updateText: string[] = []

  const splitedSteps = step.map(s => `${s}   `.match(regex)!)

  if (sumAllNumbers(splitedSteps.map(stp => stp.length)) > stdout.rows) {
    stdout.write(`You need at least ${sumAllNumbers(splitedSteps.map(stp => stp.length))} rows to continue\n`)
    exit(1)
  }

  let interval: NodeJS.Timeout | null = null

  const textUpdate = () => {
    moveCursor(stdout, 0, sumAllNumbers(splitedSteps.map(stp => stp.length)) * -1)
    cursorTo(stdout, 0)
    clearScreenDown(stdout)

    splitedSteps.forEach((split, index) => {
      stdout.write(`${Unicode.HideCursor + split.map((splt, i) => `${Colors.FgBlue}${index === 0 && i === 0 ? Symbols.Load[currentLoad] : index + 1 === step.length && i + 1 === split.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset}${index === updateText.length ? Colors.Bright : Colors.Dim}${splt.trim()}${Colors.Reset}`).join('\n')}${index === updateText.length ? Colors.Bright + dots + Colors.Reset : ''}\n`)
    })
  }

  const start = () => {
    splitedSteps.forEach((split, index) => {
      stdout.write(`${split.map((splt, i) => `${Colors.FgBlue}${index === 0 && i === 0 ? Symbols.Load[currentLoad] : index + 1 === step.length && i + 1 === split.length ? Symbols.BottomLeftCorner : Symbols.LineVertical} ${Colors.Reset}${index === updateText.length ? Colors.Bright : Colors.Dim}${splt.trim()}${Colors.Reset}`).join('\n')}${index === updateText.length ? Colors.Bright + dots + Colors.Reset : ''}\n`)
    })

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

  const next = (text: string) => {
    updateText.push(text)
  }

  const end = (text: string) => {
    if (!interval) return
    clearInterval(interval)

    moveCursor(stdout, 0, sumAllNumbers(splitedSteps.map(stp => stp.length)) * -1)
    cursorTo(stdout, 0)
    clearScreenDown(stdout)
    stdout.write(`${Colors.FgGreen + Symbols.Answered + Colors.Reset} ${Colors.Bright + text + Unicode.ShowCursor}\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset}\n`)
  }

  return {
    start,
    next,
    end,
  }
}
