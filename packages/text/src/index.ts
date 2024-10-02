import { exit, stdin, stdout } from 'node:process'
import { clearLine, cursorTo } from 'node:readline'
import { Unicode } from './constants'
import { Options } from './types'

export default function text(options: Options): Promise<string> {
  return new Promise(res => {
    // Global variables
    let userInput = ''
    let isFirstRun = true

    // Functions
    function updateConsole() {
      if (isFirstRun) isFirstRun = false
      else {
        clearLine(stdout, 0)
        cursorTo(stdout, 0)
      }

      stdout.write(`${options.message} ${userInput}`)
    }
    function endRead() {
      stdin.removeListener('data', onData)
      stdin.pause()
      console.log()
    }

    // Update the console
    updateConsole()

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
      } else {
        userInput += key
        updateConsole()
      }
    }

    // Reading stdin
    stdin.resume()
    stdin.setEncoding('utf-8')
    stdin.setRawMode(true)
    stdin.on('data', onData)
  })
}
