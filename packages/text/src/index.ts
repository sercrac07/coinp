import { exit, stdin, stdout } from 'node:process'
import { clearLine, clearScreenDown, cursorTo, moveCursor } from 'node:readline'
import { Colors, Symbols, Unicode } from './constants'
import { Options } from './types'

export default function text(options: Options): Promise<string> {
  return new Promise(res => {
    // Global variables
    let userInput = ''
    let isFirstRun = true
    const userConsole = { columns: stdout.columns, rows: stdout.rows }
    let lastInputY = 0
    let lastMessage = ''

    // Functions
    function updateConsoleOnInput() {
      if (isFirstRun) isFirstRun = false
      else {
        if (lastInputY > 0) {
          moveCursor(stdout, 0, -lastInputY)
          cursorTo(stdout, 0)
          clearScreenDown(stdout)
        } else {
          clearLine(stdout, 0)
          cursorTo(stdout, 0)
        }

        lastInputY = Math.floor(removeAnsiEscapes(lastMessage).length / userConsole.columns)
      }

      const message = `${Colors.FgBlue + Symbols.Question + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.FgCyan + Colors.Dim + Symbols.Input + Colors.Reset} ${userInput}`

      stdout.write(message)

      lastMessage = message
    }
    function updateConsoleOnBackspace() {
      const message = `${Colors.FgBlue + Symbols.Question + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.FgCyan + Colors.Dim + Symbols.Input + Colors.Reset} ${userInput}`
      lastMessage = message

      if (lastInputY > 0) {
        moveCursor(stdout, 0, -lastInputY)
        cursorTo(stdout, 0)
        clearScreenDown(stdout)
      } else {
        clearLine(stdout, 0)
        cursorTo(stdout, 0)
      }

      lastInputY = Math.floor(removeAnsiEscapes(lastMessage).length / userConsole.columns)

      stdout.write(message)
    }
    function endRead() {
      stdin.removeListener('data', onData)
      stdin.pause()
      stdout.removeListener('resize', onResize)
      console.log()
    }
    function onResize() {
      userConsole.columns = stdout.columns
      userConsole.rows = stdout.rows
      checkIfValidConsole()
      updateConsoleOnInput()
    }
    function endConsole(message: string) {
      endRead()
      console.error(message)
      exit()
    }
    function checkIfValidConsole() {
      if (!stdin.isTTY) {
        if (options.default) res(options.default)
        else endConsole('This is not a TTY terminal')
      }
      if (userConsole.columns < 20 || userConsole.rows < 3) {
        endConsole('Terminal size is too small. Minimum size is 20x3')
      }
    }
    function removeAnsiEscapes(str: string) {
      const ansiEscapeRegex = /\x1b\[[0-9;]*m/g
      return str.replace(ansiEscapeRegex, '')
    }

    // Update the console
    checkIfValidConsole()
    updateConsoleOnInput()

    // Function to handle data
    function onData(data: Buffer) {
      const key = data.toString()

      // Check if the key pressed is the escape key
      if (key === Unicode.ControlC || key === Unicode.Esc) {
        endRead()
        exit()
      } else if (key === Unicode.Enter) {
        endRead()
        res(userInput)
      } else if (Unicode.Backspace.includes(key as any)) {
        if (userInput.length > 0) {
          userInput = userInput.slice(0, -1)
        }
        updateConsoleOnBackspace()
      } else {
        userInput += key
        updateConsoleOnInput()
      }
    }

    // Reading stdin
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)
    stdin.on('data', onData)
    stdout.on('resize', onResize)
  })
}
