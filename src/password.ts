import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface PasswordOptions {
  /** Message to display to the user. */
  message: string
  /** The initial value. */
  initialValue?: string
  /** An invisible message, displayed only when there is no value. */
  placeholder?: string
  /** A default value when no value has been entered. */
  defaultValue?: string
  /** A function that allows verifying the value entered by the user before submitting it. */
  verify?: (value: string) => string | undefined | void
  /** A function that runs when the operation is canceled. */
  onCancel?: () => void
}

/** The password function allows for the secure input of user data, hiding the text as it's entered. It supports default values and real-time validation. */
export function password(options: PasswordOptions): Promise<string> {
  return new Promise<string>(resolve => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    let userInput = options.initialValue ?? ''
    const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')

    const splitedTitle = options.message.match(regex)!
    const splitedUserInput = userInput.match(regex) ?? ['']

    if (splitedTitle.length + 2 > stdout.rows) {
      stdout.write(`You need at least ${splitedTitle.length + 2} rows to continue\n`)
      exit(1)
    }

    if (stdout.columns <= 8) {
      stdout.write('You need at least 9 columns to continue\n')
      exit(1)
    }

    let splitedPlaceholder: false | string[] = false

    if (options.placeholder) splitedPlaceholder = options.placeholder.match(regex) ?? ['']

    let toShow: string[]
    let is: 'placeholder' | 'input'

    if (userInput.length === 0 && options.placeholder) {
      toShow = splitedPlaceholder as string[]
      is = 'placeholder'
    } else {
      toShow = splitedUserInput
      is = 'input'
    }

    if (toShow.length > stdout.rows - splitedTitle.length - 1) {
      toShow = toShow.slice((stdout.rows - splitedTitle.length - 1) * -1)
      toShow[0] = toShow[0].replace(/^.{3}/g, '...')
    }

    stdout.write(
      `${splitedTitle
        .map((title, index) => {
          if (index === 0) return `${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
          else return `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
        })
        .join('\n')}\n`
    )

    stdout.write(`${toShow.map(input => `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${is === 'placeholder' ? Colors.Dim : ''}${input.replace(/./g, '*') + Colors.Reset}`).join('\n')}\n${Colors.FgBlue + Symbols.BottomLeftCorner + Colors.Reset} `)

    if (is === 'input') moveCursor(stdout, 0, -1)
    else moveCursor(stdout, 0, toShow.length * -1)

    cursorTo(stdout, splitedUserInput[splitedUserInput.length - 1].length + 2)

    const listener = (data: Buffer) => {
      const key = data.toString()

      const isCancel = key === Unicode.ControlC || key === Unicode.Esc
      const isDel = key === Unicode.Backspace
      const isEnter = key === Unicode.Enter
      const isArrow = key === Unicode.UpArrow || key === Unicode.DownArrow || key === Unicode.RightArrow || key === Unicode.LeftArrow

      const updateConsole = (type: 'add' | 'del' | 'enter' | 'cancel' | 'err', err?: string) => {
        const splitedContent = userInput.match(regex) ?? ['']

        if (userInput.length === 0 && options.placeholder) {
          toShow = splitedPlaceholder as string[]
          is = 'placeholder'
        } else {
          toShow = splitedContent
          is = 'input'
        }

        if (toShow.length > stdout.rows - splitedTitle.length - 1) {
          toShow = toShow.slice((stdout.rows - splitedTitle.length - 1) * -1)
          toShow[0] = toShow[0].replace(/^.{3}/g, '...')
        }

        let extraJump = 0

        if (type === 'add') {
          if (toShow.length !== 1 && toShow[toShow.length - 1].length === 1) extraJump--
        } else if (type === 'del') {
          if (toShow[toShow.length - 1].length > stdout.columns - 3) extraJump++
        }

        const color = type === 'enter' ? Colors.FgGreen : type === 'cancel' ? Colors.FgRed : type === 'err' ? Colors.FgYellow : Colors.FgBlue
        const extraColor = type === 'enter' ? Colors.Bright + Colors.FgGreen : type === 'cancel' ? Colors.FgRed : ''
        const symbol = type === 'enter' ? Symbols.Answered : type === 'cancel' || type === 'err' ? Symbols.Error : Symbols.Unanswered
        const line = type === 'enter' ? Symbols.LineVertical : Symbols.BottomLeftCorner

        if ((type === 'enter' || type === 'cancel') && is === 'placeholder') toShow = ['']

        moveCursor(stdout, 0, (toShow.length - 1 + extraJump + splitedTitle.length) * -1)
        cursorTo(stdout, 0)
        clearScreenDown(stdout)

        stdout.write(
          `${splitedTitle
            .map((title, index) => {
              if (index === 0) return `${color + symbol + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
              else return `${color + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
            })
            .join('\n')}\n`
        )
        stdout.write(`${toShow.map(input => `${color + Symbols.LineVertical + Colors.Reset} ${is === 'placeholder' ? Colors.Dim : extraColor}${input.replace(/./g, '*') + Colors.Reset}`).join('\n')}\n${color + line} `)

        if (type === 'cancel' && !options.onCancel) stdout.write('Operation cancelled')
        else if (type === 'err' && err) {
          const errSplited = err.match(regex)!
          let showErr = ''

          if (errSplited.length > 1) showErr = errSplited[0].slice(0, -3) + '...'
          else showErr = errSplited[0]

          stdout.write(showErr)
        }

        stdout.write(Colors.Reset)

        if (is === 'input') moveCursor(stdout, 0, -1)
        else moveCursor(stdout, 0, toShow.length * -1)

        cursorTo(stdout, splitedContent[splitedContent.length - 1].length + 2)
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
        if (options.verify && typeof options.verify(userInput) === 'string') return updateConsole('err', options.verify(userInput)!)

        if (userInput.length === 0 && options.defaultValue !== undefined) userInput = options.defaultValue
        updateConsole('enter')
        moveCursor(stdout, 0, 1)
        stdout.write('\n')
        stdin.removeListener('data', listener)
        stdin.pause()
        resolve(userInput)
      } else if (isDel) {
        userInput = userInput.slice(0, -1)
        updateConsole('del')
      } else {
        if (isArrow) return

        userInput += key
        updateConsole('add')
      }
    }

    stdin.on('data', listener)
  })
}
