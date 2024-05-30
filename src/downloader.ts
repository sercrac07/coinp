import { stdin, stdout } from 'process'
import { Colors, Symbols, Unicode } from './lib/consts'
import { clearScreenDown, cursorTo, moveCursor } from 'readline'

interface Downloader {
  /** Starts the downloader. */
  start: (text: string, percent?: number) => void
  /** Updates the downloader percentage. */
  update: (percent: number) => void
  /** Ends the downloader. */
  end: (text: string) => void
}

/** The `downloader` function enables the creation of a download animation, providing visual tracking on downloads. */
export function downloader(onCancel?: () => void): Downloader {
  const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')

  let currentPercent = 0
  let splitedText: string[]
  let ended = false

  const listener = (data: Buffer) => {
    const key = data.toString()
    const isCancel = key === Unicode.ControlC || key === Unicode.Esc

    if (isCancel) {
      cursorTo(stdout, 0)
      moveCursor(stdout, 0, splitedText.length * -1)
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

  const updateConsole = () => {
    const length = stdout.columns - 4
    const showLength = Math.floor((currentPercent / 100) * length)

    cursorTo(stdout, 0)
    clearScreenDown(stdout)

    stdout.write(`${Colors.FgBlue + Symbols.BottomLeftCorner} (${'#'.repeat(showLength) + '.'.repeat(length - showLength)})`)
  }

  const start = (text: string, percent?: number) => {
    if (splitedText) throw new Error('Downloader has already started')

    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    stdin.on('data', listener)

    if (percent) currentPercent = percent
    splitedText = text.match(regex) ?? ['']

    stdout.write(`${Unicode.HideCursor + splitedText.map((txt, index) => `${Colors.FgBlue}${index === 0 ? Symbols.Unanswered : Symbols.LineVertical}${Colors.Reset} ${Colors.Bright + txt + Colors.Reset}`).join('\n')}\n`)

    const length = stdout.columns - 4
    const showLength = Math.floor((currentPercent / 100) * length)
    stdout.write(`${Colors.FgBlue + Symbols.BottomLeftCorner} (${'#'.repeat(showLength) + '.'.repeat(length - showLength)})`)
  }

  const end = (text: string) => {
    if (!splitedText) throw new Error("Downloader hasn't started yet")
    ended = true

    stdin.removeListener('data', listener)
    stdin.pause()

    moveCursor(stdout, 0, splitedText.length * -1)
    cursorTo(stdout, 0)
    clearScreenDown(stdout)

    splitedText = text.match(regex) ?? ['']

    stdout.write(`${Unicode.ShowCursor + splitedText.map((txt, index) => `${Colors.FgGreen}${index === 0 ? Symbols.Answered : Symbols.LineVertical}${Colors.Reset} ${Colors.Bright + txt + Colors.Reset}`).join('\n')}\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset}\n`)
  }

  const update = (percent: number) => {
    if (!splitedText) throw new Error("Downloader hasn't started yet")
    if (ended) throw new Error('Downloader has already ended')
    currentPercent = percent
    updateConsole()
  }

  return {
    start,
    end,
    update,
  }
}
