import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface SelectOptions<T extends string> {
  /** Message to display to the user. */
  message: string
  /** All the options available for the user to choose from. */
  choices: SelectChoice<T>[]
  /** The initial cursor position. */
  cursorAt?: NoInfer<T>
  /** A function that runs when the operation is canceled. */
  onCancel?: () => void
}

interface SelectChoice<T extends string> {
  /** Text to display. */
  label: string
  /** The return value */
  value: T
  /** Displays a message when the user hovers over an option. */
  hint?: string
}

/** The `list` function empowers users to select a single option from a predefined list of choices. */
export function select<T extends string>(options: SelectOptions<T>): Promise<T> {
  return new Promise<T>(resolve => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    let userCurrent = options.cursorAt && options.choices.findIndex(choice => choice.value === options.cursorAt) !== -1 ? options.choices.findIndex(choice => choice.value === options.cursorAt) : 0
    const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')
    const choiceRegex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')

    const splitedTitle = options.message.match(regex)!
    const showLines = options.choices.map(choice => choice.label).slice((stdout.rows - splitedTitle.length - 1) * -1)

    if (splitedTitle.length + 1 > stdout.rows) {
      stdout.write(`You need at least ${splitedTitle.length + 2} rows to continue\n`)
      exit(1)
    }

    if (stdout.columns <= 8) {
      stdout.write('You need at least 9 columns to continue\n')
      exit(1)
    }

    let showing: [number, number] = [0, showLines.length]

    if (userCurrent !== 0) {
      const dif = showLines.length

      if (options.choices.length === userCurrent + 1) showing = [options.choices.length - dif, options.choices.length]
      else if (userCurrent + 1 > options.choices.length - dif) showing = [options.choices.length - dif, options.choices.length]
      else showing = [userCurrent, userCurrent + dif]
    }

    let showOptions = options.choices.map(choice => choice).slice(showing[0], showing[1])
    let linesOptions = showOptions.map(choice => ({ content: choice.label.match(choiceRegex)!, hint: choice.hint }))

    stdout.write(
      `${
        Unicode.HideCursor +
        splitedTitle
          .map((title, index) => {
            if (index === 0) return `${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
            else return `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
          })
          .join('\n')
      }\n`
    )

    stdout.write(
      `${linesOptions
        .map((line, index) => {
          const canHint = line.hint !== undefined && index + showing[0] === userCurrent
          const diffHint = canHint ? stdout.columns - (line.content[0].length + 4) - (line.hint!.length + 3) : 0
          if (line.content.length !== 1) return `${Colors.FgBlue + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${index + showing[0] === userCurrent ? Symbols.RightArrow : ' '} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0].slice(0, -3)}...${Colors.Reset}`
          return `${Colors.FgBlue + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${index + showing[0] === userCurrent ? Symbols.RightArrow : ' '} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${`${line.content[0] + Colors.Reset + Colors.Dim}${canHint ? ` (${line.hint!})`.slice(0, diffHint < 0 ? diffHint : undefined) : ''}` + Colors.Reset}`
        })
        .join('\n')}\n${Colors.FgBlue + Symbols.BottomLeftCorner} ${options.choices.length > showOptions.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > showOptions.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}${Colors.Reset}`
    )

    const listener = (data: Buffer) => {
      const key = data.toString()

      const isCancel = key === Unicode.ControlC || key === Unicode.Esc
      const isEnter = key === Unicode.Enter
      const isUpArrow = key === Unicode.UpArrow
      const isDownArrow = key === Unicode.DownArrow

      const updateConsole = (type: 'arrow' | 'enter' | 'cancel') => {
        const color = type === 'arrow' ? Colors.FgBlue : Colors.FgRed
        const symbol = type === 'arrow' ? Symbols.Unanswered : Symbols.Error

        moveCursor(stdout, 0, (splitedTitle.length + options.choices.length) * -1)
        cursorTo(stdout, 0)
        clearScreenDown(stdout)

        if (type === 'enter') {
          return stdout.write(
            `${
              Unicode.ShowCursor +
              splitedTitle
                .map((title, index) => {
                  if (index === 0) return `${Colors.FgGreen + Symbols.Answered + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
                  else return `${Colors.FgGreen + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
                })
                .join('\n')
            }\n${Colors.FgGreen + Symbols.LineVertical} ${Colors.Bright + options.choices[userCurrent].label + Colors.Reset}\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset + Unicode.ShowCursor}`
          )
        }

        showOptions = options.choices.map(choice => choice).slice(showing[0], showing[1])
        linesOptions = showOptions.map(choice => ({ content: choice.label.match(choiceRegex)!, hint: choice.hint }))

        stdout.write(
          `${
            Unicode.HideCursor +
            splitedTitle
              .map((title, index) => {
                if (index === 0) return `${color + symbol + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
                else return `${color + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
              })
              .join('\n')
          }\n`
        )

        stdout.write(
          `${linesOptions
            .map((line, index) => {
              const canHint = line.hint !== undefined && index + showing[0] === userCurrent
              const diffHint = canHint ? stdout.columns - (line.content[0].length + 4) - (line.hint!.length + 3) : 0
              if (line.content.length !== 1) return `${color + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${index + showing[0] === userCurrent ? Symbols.RightArrow : ' '} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0].slice(0, -3)}...${Colors.Reset}`
              return `${color + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${index + showing[0] === userCurrent ? Symbols.RightArrow : ' '} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${`${line.content[0] + Colors.Reset + Colors.Dim}${canHint ? ` (${line.hint!})`.slice(0, diffHint < 0 ? diffHint : undefined) : ''}` + Colors.Reset}`
            })
            .join('\n')}\n${color + Symbols.BottomLeftCorner} ${options.choices.length > showOptions.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > showOptions.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}`
        )

        if (type === 'cancel') {
          stdout.write(Unicode.ShowCursor)
          if (!options.onCancel) stdout.write('Operation cancelled')
        }

        stdout.write(Colors.Reset)
      }

      if (isCancel) {
        updateConsole('cancel')
        moveCursor(stdout, 0, 1)
        if (options.onCancel) {
          stdin.removeListener('data', listener)
          stdin.pause()
          cursorTo(stdout, 2)
          options.onCancel()
        } else {
          stdout.write('\n')
          process.exit(0)
        }
      } else if (isEnter) {
        updateConsole('enter')
        stdout.write('\n')
        stdin.removeListener('data', listener)
        stdin.pause()
        resolve(options.choices[userCurrent].value)
      } else if (isUpArrow) {
        if (userCurrent !== 0) userCurrent--
        if (showing[0] !== 0 && userCurrent === showing[0] - 1) {
          showing[0]--
          showing[1]--
        }
        updateConsole('arrow')
      } else if (isDownArrow) {
        if (userCurrent !== options.choices.length - 1) userCurrent++
        if (showing[1] !== options.choices.length && userCurrent === showing[1]) {
          showing[0]++
          showing[1]++
        }
        updateConsole('arrow')
      }
    }

    stdin.on('data', listener)
  })
}
