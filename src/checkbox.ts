import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface CheckboxOptions<T extends string> {
  /** Message to display to the user. */
  message: string
  /** All the options available for the user to choose from. */
  choices: CheckboxChoice<T>[]
  /** The initial cursor value. */
  cursorAt?: NoInfer<T>
  /** All initial values that will appear as selected. */
  initialValues?: NoInfer<T>[]
  /** A function that allows verifying the value entered by the user before submitting it. */
  verify?: (value: T[]) => string | undefined | void
  /** A function that runs when the operation is canceled. */
  onCancel?: () => void
}

interface CheckboxChoice<T extends string> {
  /** Text to display. */
  label: string
  /** The return value */
  value: T
}

/** The `checkbox` function provides users with the capability to select multiple options simultaneously from a predefined list of choices. */
export function checkbox<T extends string>(options: CheckboxOptions<T>): Promise<T[]> {
  return new Promise<T[]>(resolve => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    let userCurrent = options.cursorAt && options.choices.findIndex(choice => choice.value === options.cursorAt) !== -1 ? options.choices.findIndex(choice => choice.value === options.cursorAt) : 0
    const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')
    const choiceRegex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')

    const userSelection: T[] = []

    if (options.initialValues) {
      options.initialValues.forEach(value => {
        if (userSelection.includes(value)) return
        userSelection.push(value)
      })
    }

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
    let linesOptions = showOptions.map(choice => ({ content: choice.label.match(choiceRegex)!, selected: userSelection.includes(choice.value) }))

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
          if (line.content.length !== 1) return `${Colors.FgBlue + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${line.selected ? Symbols.Selected : Symbols.Unselected} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0].slice(0, -3)}...${Colors.Reset}`
          return `${Colors.FgBlue + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${line.selected ? Symbols.Selected : Symbols.Unselected} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0] + Colors.Reset}`
        })
        .join('\n')}\n${Colors.FgBlue + Symbols.BottomLeftCorner} ${options.choices.length > showOptions.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > showOptions.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}${Colors.Reset}`
    )

    const listener = (data: Buffer) => {
      const key = data.toString()

      const isCancel = key === Unicode.ControlC || key === Unicode.Esc
      const isEnter = key === Unicode.Enter
      const isSpace = key === Unicode.Spacebar
      const isUpArrow = key === Unicode.UpArrow
      const isDownArrow = key === Unicode.DownArrow

      const updateConsole = (type: 'arrow' | 'enter' | 'cancel' | 'err', err?: string) => {
        const color = type === 'cancel' ? Colors.FgRed : type === 'err' ? Colors.FgYellow : Colors.FgBlue
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
            }\n${Colors.FgGreen + Symbols.LineVertical} ${
              Colors.Bright +
              options.choices
                .filter(choice => userSelection.includes(choice.value))
                .map(choice => choice.label)
                .join(', ') +
              Colors.Reset
            }\n${Colors.FgGreen + Symbols.LineVertical + Colors.Reset + Unicode.ShowCursor}`
          )
        }

        showOptions = options.choices.map(choice => choice).slice(showing[0], showing[1])
        linesOptions = showOptions.map(choice => ({ content: choice.label.match(choiceRegex)!, selected: userSelection.includes(choice.value) }))

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
              if (line.content.length !== 1) return `${color + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${line.selected ? Symbols.Selected : Symbols.Unselected} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0].slice(0, -3)}...${Colors.Reset}`
              return `${color + Symbols.LineVertical} ${index + showing[0] === userCurrent ? '' : Colors.Reset}${line.selected ? Symbols.Selected : Symbols.Unselected} ${index + showing[0] === userCurrent ? Colors.Underscore : ''}${line.content[0] + Colors.Reset}`
            })
            .join('\n')}\n${color + Symbols.BottomLeftCorner} ${options.choices.length > showOptions.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > showOptions.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}`
        )

        if (type === 'cancel') {
          stdout.write(Unicode.ShowCursor)
          if (!options.onCancel) stdout.write('Operation cancelled')
        } else if (type === 'err' && err) {
          const errSplited = err.match(regex)!
          let showErr = ''

          if (errSplited.length > 1) showErr = errSplited[0].slice(0, -3) + '...'
          else showErr = errSplited[0]

          stdout.write(showErr)
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
        if (options.verify && typeof options.verify(userSelection) === 'string') return updateConsole('err', options.verify(userSelection)!)

        updateConsole('enter')
        stdout.write('\n')
        stdin.removeListener('data', listener)
        stdin.pause()
        resolve(userSelection)
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
      } else if (isSpace) {
        if (userSelection.includes(options.choices[userCurrent].value)) userSelection.splice(userSelection.indexOf(options.choices[userCurrent].value), 1)
        else userSelection.push(options.choices[userCurrent].value)
        updateConsole('arrow')
      }
    }

    stdin.on('data', listener)
  })
}
