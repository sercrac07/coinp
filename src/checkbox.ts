import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface CheckboxOptions<T extends string> {
  message: string
  choices: CheckboxChoice<T>[]
  initialValue?: NoInfer<T>
}

interface CheckboxChoice<T extends string> {
  label: string
  value: T
}

/**
 * The `checkbox` function provides users with the capability to select multiple options simultaneously from a predefined list of choices.
 *
 * ```javascript
 * const food = await checkbox({
 *   message: "What's your favorite food?",
 *   choices: [
 *     { label: 'Pizza', value: 'pizza' },
 *     { label: 'Burger', value: 'burger' },
 *     { label: 'Rice', value: 'rice' },
 *   ],
 * })
 * ```
 */
export function checkbox<T extends string>(options: CheckboxOptions<T>): Promise<T[]> {
  return new Promise<T[]>(resolve => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    let userCurrent = options.initialValue && options.choices.findIndex(choice => choice.value === options.initialValue) !== -1 ? options.choices.findIndex(choice => choice.value === options.initialValue) : 0
    const userSelection: T[] = []
    const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')
    const choiceRegex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')

    const splitedTitle = options.message.match(regex)!
    const showLines = options.choices.map(choice => choice.label).slice((stdout.rows - splitedTitle.length - 1) * -1)

    let showing: [number, number] = [0, showLines.length]

    if (userCurrent !== 0) {
      const dif = showLines.length

      if (options.choices.length === userCurrent + 1) showing = [options.choices.length - dif, options.choices.length]
      else if (userCurrent + 1 > options.choices.length - dif) showing = [options.choices.length - dif, options.choices.length]
      else showing = [userCurrent, userCurrent + dif]
    }

    const showOptions = options.choices.map(choice => choice).slice(showing[0], showing[1])
    const linesOptions = showOptions.map(choice => ({ content: choice.label.match(choiceRegex)!, selected: userSelection.includes(choice.value) }))

    if (splitedTitle.length + 1 > stdout.rows) {
      stdout.write(`You need at least ${splitedTitle.length + 2} rows to continue\n`)
      exit(1)
    }

    if (stdout.columns <= 8) {
      stdout.write('You need at least 9 columns to continue\n')
      exit(1)
    }

    stdout.write(
      splitedTitle
        .map((title, index) => {
          if (index === 0) return `${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
          else return `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
        })
        .join('') +
        Unicode.HideCursor +
        '\n' +
        linesOptions
          .map((line, index) => {
            if (line.content.length !== 1) return `${Colors.FgBlue + Symbols.LineVertical} ${line.selected ? Symbols.Selected : Symbols.Unselected}${index + showing[0] === userCurrent ? '' : Colors.Reset} ${line.content[0].slice(0, -3)}...`
            return `${Colors.FgBlue + Symbols.LineVertical} ${line.selected ? Symbols.Selected : Symbols.Unselected}${index + showing[0] === userCurrent ? '' : Colors.Reset} ${line.content[0]}`
          })
          .join('\n') +
        `\n${Colors.FgBlue + Symbols.BottomLeftCorner} ${options.choices.length > showOptions.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > showOptions.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}${Colors.Reset}`
    )

    const listener = (data: Buffer) => {
      const key = data.toString()

      const isCancel = key === Unicode.ControlC || key === Unicode.Esc
      const isDel = key === Unicode.Backspace
      const isEnter = key === Unicode.Enter
      const isSpace = key === Unicode.Spacebar
      const isUpArrow = key === Unicode.UpArrow
      const isDownArrow = key === Unicode.DownArrow
      const isOtherArrow = key === Unicode.RightArrow || key === Unicode.LeftArrow

      const updateConsole = (type: 'arrow' | 'enter' | 'cancel') => {
        const col = type === 'arrow' ? Colors.FgBlue : type === 'enter' ? Colors.FgGreen : Colors.FgRed
        const symbol = type === 'arrow' ? Symbols.Unanswered : type === 'enter' ? Symbols.Answered : Symbols.Error

        moveCursor(stdout, 0, (splitedTitle.length + options.choices.length) * -1)
        clearScreenDown(stdout)
        cursorTo(stdout, 0)

        if (type === 'enter') {
          return stdout.write(
            splitedTitle
              .map((title, index) => {
                if (index === 0) return `${col + symbol + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
                else return `${col + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
              })
              .join('') +
              '\n' +
              `${col + Symbols.LineVertical} ${options.choices
                .filter(choice => userSelection.includes(choice.value))
                .map(choice => choice.label)
                .join(', ')}\n${col + Symbols.LineVertical + Colors.Reset}`
          )
        }

        const toShow = options.choices.map(choice => choice).slice(showing[0], showing[1])

        let toShowLines = toShow.map(show => ({ content: show.label.match(choiceRegex)!, selected: userSelection.includes(show.value) }))

        stdout.write(
          splitedTitle
            .map((title, index) => {
              if (index === 0) return `${col + symbol + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
              else return `${col + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
            })
            .join('') +
            Unicode.HideCursor +
            '\n' +
            toShowLines
              .map((line, index) => {
                if (line.content.length !== 1) return `${col + Symbols.LineVertical} ${line.selected ? Symbols.Selected : Symbols.Unselected}${index + showing[0] === userCurrent ? '' : Colors.Reset} ${line.content[0].slice(0, -3)}...`
                return `${col + Symbols.LineVertical} ${line.selected ? Symbols.Selected : Symbols.Unselected}${index + showing[0] === userCurrent ? '' : Colors.Reset} ${line.content[0]}`
              })
              .join('\n') +
            `\n${col + Symbols.BottomLeftCorner} ${options.choices.length > toShow.length && showing[0] !== 0 ? `${Symbols.TopArrow} ` : ''}${options.choices.length > toShow.length && showing[1] !== options.choices.length ? `${Symbols.DownArrow} ` : ''}${type === 'cancel' ? 'Operation cancelled' : ''}${Colors.Reset}`
        )
      }

      if (isCancel) {
        updateConsole('cancel')
        stdout.write('\n' + Unicode.ShowCursor)
        process.exit(0)
      } else if (isEnter) {
        updateConsole('enter')
        stdout.write('\n' + Unicode.ShowCursor)
        resolve(userSelection)
        stdin.removeListener('data', listener)
        stdin.pause()
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
