import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

interface TextOptions {
  message: string
  initialValue?: string
  placeholder?: string
  verify?: (output: string) => string | undefined | void
}

/**
 * The `text` function enables the retrieval of user input in text format. This feature provides the ability to display default values and perform real-time validation on the input provided by the user.
 *
 * ```javascript
 * const name = await text({ message: "What's your name?" })
 * ```
 */
export function text(options: TextOptions): Promise<string> {
  return new Promise<string>(resolve => {
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)

    let userInput = options.initialValue ?? ''
    const regex = new RegExp(`.{1,${stdout.columns - 2}}`, 'g')

    const splitedTitle = options.message.match(regex)!
    const splitedUserInput = userInput.match(regex) ?? ['']
    let splitedPlaceholder: false | string[] = false
    let linePlaceholder: string[]

    if (options.placeholder) {
      linePlaceholder = options.placeholder.match(regex)!
      splitedPlaceholder = linePlaceholder.slice((stdout.rows - splitedTitle.length - 1) * -1)

      if (linePlaceholder.length > stdout.rows - splitedTitle.length - 1) {
        splitedPlaceholder[0] = splitedPlaceholder[0].replace(/^.{3}/g, '...')
      }
    }

    if (splitedTitle.length + 2 > stdout.rows) {
      stdout.write(`You need at least ${splitedTitle.length + 2} rows to continue\n`)
      exit(1)
    }

    if (stdout.columns <= 8) {
      stdout.write('You need at least 9 columns to continue\n')
      exit(1)
    }

    let toShow: string[]
    let is: 'placeholder' | 'input'

    if (splitedPlaceholder && userInput.length === 0) {
      toShow = splitedPlaceholder
      is = 'placeholder'
    } else {
      toShow = splitedUserInput.slice((stdout.rows - splitedTitle.length - 1) * -1)
      if (splitedUserInput.length > stdout.rows - splitedTitle.length - 1) {
        toShow[0] = toShow[0].replace(/^.{3}/g, '...')
      }
      is = 'input'
    }

    stdout.write(
      splitedTitle
        .map((title, index) => {
          if (index === 0) return `${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
          else return `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
        })
        .join('') +
        '\n' +
        toShow.map(input => `${Colors.FgBlue + Symbols.LineVertical + Colors.Reset} ${is === 'placeholder' ? Colors.Dim : ''}${input + Colors.Reset}`).join('') +
        `\n${Colors.FgBlue + Symbols.BottomLeftCorner + Colors.Reset} `
    )
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
        const showContent = splitedContent.slice((stdout.rows - splitedTitle.length - 1) * -1)

        if (splitedContent.length > stdout.rows - splitedTitle.length - 1) {
          showContent[0] = showContent[0].replace(/^.{3}/g, '...')
        }

        const col = type === 'enter' ? Colors.FgGreen : type === 'cancel' ? Colors.FgRed : type === 'err' ? Colors.FgYellow : Colors.FgBlue
        const sym = type === 'enter' ? Symbols.Answered : type === 'cancel' || type === 'err' ? Symbols.Error : Symbols.Unanswered

        let extraJump = 0

        if (type === 'add') {
          if (showContent.length !== 1 && showContent[showContent.length - 1].length === 1) extraJump--
        } else if (type === 'del') {
          if (showContent[showContent.length - 1].length > stdout.columns - 3) extraJump++
        }

        if (splitedPlaceholder && userInput.length === 0) {
          toShow = splitedPlaceholder
          is = 'placeholder'
        } else {
          toShow = showContent
          is = 'input'
        }

        moveCursor(stdout, 0, (showContent.length - 1 + splitedTitle.length + extraJump) * -1)
        cursorTo(stdout, 0)
        clearScreenDown(stdout)
        stdout.write(
          splitedTitle
            .map((title, index) => {
              if (index === 0) return `${col + sym + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
              else return `${col + Symbols.LineVertical + Colors.Reset} ${Colors.Bright + title + Colors.Reset}`
            })
            .join('') + '\n'
        )
        if (type === 'enter') stdout.write(showContent.map(input => `${col + Symbols.LineVertical + Colors.Reset} ${Colors.FgGreen + input + Colors.Reset}`).join(''))
        else if (type === 'cancel') stdout.write(showContent.map(input => `${col + Symbols.LineVertical + Colors.Reset} ${col + input + Colors.Reset}`).join(''))
        else stdout.write(toShow.map(input => `${col + Symbols.LineVertical + Colors.Reset} ${is === 'placeholder' ? Colors.Dim : ''}${input + Colors.Reset}`).join(''))

        if (type === 'err') {
          const errSplited = err!.match(regex)!
          let showErr = ''

          if (errSplited.length > 1) showErr = errSplited[0].slice(0, -3) + '...'
          else showErr = errSplited[0]

          stdout.write(`\n${col + Symbols.BottomLeftCorner} ${showErr + Colors.Reset}`)
        } else stdout.write(`\n${col}${type === 'enter' ? Symbols.LineVertical : Symbols.BottomLeftCorner} ${type === 'cancel' ? 'Operation cancelled' : ''}${Colors.Reset}`)

        if (is === 'input' || type === 'cancel') moveCursor(stdout, 0, -1)
        else moveCursor(stdout, 0, toShow.length * -1)

        cursorTo(stdout, showContent[showContent.length - 1].length + 2)
      }

      if (isCancel) {
        updateConsole('cancel')
        moveCursor(stdout, 0, 1)
        stdout.write('\n')
        process.exit(0)
      } else if (isEnter) {
        if (options.verify && typeof options.verify(userInput) === 'string') return updateConsole('err', options.verify(userInput)!)

        updateConsole('enter')
        moveCursor(stdout, 0, 1)
        stdout.write('\n')
        resolve(userInput)
        stdin.removeListener('data', listener)
        stdin.pause()
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
