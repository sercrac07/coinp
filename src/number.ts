import { exit, stdin, stdout } from "node:process"
import { clearScreenDown, moveCursor, cursorTo, clearLine } from "node:readline"
import { Colors, Symbols, Unicode } from "./lib/consts"
import { clearString, splitArray, splitHeight } from "./lib/utils"

interface NumberOptions {
  /** A message to display to the user. */
  message: string
  /** A preview number to display to the user. */
  placeholder?: number
  /** A default value when no value has been entered. */
  defaultValue?: number
  /** A initial value. */
  initialValue?: number
  /** A function that allows verifying the value entered by the user before submitting it. */
  validate?: (value: number) => string | void
  /** A flag that allows for negative numbers. */
  negative?: boolean
  /** A flag that allows for decimals. */
  decimals?: boolean
}

/** The text function allows for the input of user data. */
export function number(options: NumberOptions): Promise<number> {
  return new Promise(resolve => {
    // Global variables
    const widthRegex = new RegExp(`.{1,${stdout.columns}}`, "g")
    let lastJump = 0
    let lastError: [boolean, number] = [false, 0]

    // Reading stdin
    stdin.resume()
    stdin.setEncoding("utf-8")
    stdin.setRawMode(true)

    // Get the initial message
    let userInput = options.initialValue?.toString() ?? ""
    let showMessage = ""

    // Update the console with the user input
    const updateConsole = (type: "enter" | "input" | "intro" | "err" = "input", extra?: string) => {
      if (lastError[0]) {
        moveCursor(stdout, 0, lastError[1] * -1)
        lastError = [false, 0]
      }

      const symbol = type === "enter" ? Symbols.Answered : type === "err" ? Symbols.Error : Symbols.Unanswered
      const color = type === "enter" ? Colors.FgGreen : type === "err" ? Colors.FgYellow : Colors.FgBlue
      const inputColor = type === "enter" ? Colors.Dim + Colors.FgGreen : ""

      if (options.placeholder !== undefined && userInput.length === 0 && type !== "enter")
        showMessage = `${color + symbol + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.Dim + ">>" + Colors.Reset} ${Colors.Dim + options.placeholder + Colors.Reset}`
      else
        showMessage = `${color + symbol + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.Dim + ">>" + Colors.Reset} ${inputColor}${
          type === "enter" ? Number(userInput).toString() : userInput
        }${Colors.Reset}`

      const splitedMessage = splitHeight(clearString(showMessage), showMessage, stdout.columns)
      const displayText = splitArray(splitedMessage.ansi, stdout.rows, Math.ceil((clearString(options.message).length + 6) / stdout.columns))

      if (type !== "intro") {
        // Clean the console depending on the message line height
        if (splitedMessage.normal.length === 1 && lastJump === 0) {
          cursorTo(stdout, 0)
          clearLine(stdout, 0)
        } else {
          moveCursor(stdout, 0, lastJump)
          cursorTo(stdout, 0)
          clearScreenDown(stdout)
        }
      }

      stdout.write(displayText.join(""))

      lastJump = (splitedMessage.normal.length - 1) * -1

      if (type === "err") {
        stdout.write("\n")
        stdout.write(Colors.FgYellow + extra + Colors.Reset)
        const splitedExtra = [...extra!.match(widthRegex)!]
        const extraJump = splitedExtra.length * -1
        lastError = [true, extraJump]
        moveCursor(stdout, 0, extraJump)
        cursorTo(stdout, splitedMessage.normal.at(-1)!.length)
        lastJump += splitedExtra.length * -1
      }
    }

    updateConsole("intro")

    const dataListener = (data: Buffer) => {
      // Get the key pressed
      const key = data.toString()
      const exitKey = key === Unicode.ControlC || key === Unicode.Esc
      const enterKey = key === Unicode.Enter
      const backspaceKey = Unicode.Backspace.includes(key as any)
      const controlBackspaceKey = key === Unicode.ControlBackspace
      const tabKey = key === Unicode.Tab
      const validKey = "0123456789".includes(key)

      // Checks the key pressed
      if (exitKey) {
        stdin.removeListener("data", dataListener)
        exit()
      } else if (backspaceKey) {
        userInput = userInput.slice(0, -1)
        updateConsole()
      } else if (controlBackspaceKey) {
        userInput = userInput.split(" ").slice(0, -1).join(" ")
        updateConsole()
      } else if (enterKey) {
        if (userInput.length === 0 && options.defaultValue !== undefined) userInput = options.defaultValue.toString()
        if (options.validate !== undefined && typeof options.validate(Number(userInput)) === "string") return updateConsole("err", options.validate(Number(userInput))!)
        updateConsole("enter")
        stdout.write("\n")
        stdin.removeListener("data", dataListener)
        stdin.pause()
        resolve(Number(userInput))
      } else if (tabKey) {
        if (userInput.length === 0 && options.placeholder !== undefined) userInput = options.placeholder.toString()
        updateConsole()
      } else if (validKey) {
        userInput += key
        updateConsole()
      } else if (key === "-") {
        if (options.negative && userInput.length === 0) {
          userInput = "-"
          updateConsole()
        }
      } else if (key === ".") {
        if (options.decimals && userInput.length === 0 && !userInput.includes(".")) {
          userInput += "."
          updateConsole()
        }
      }
    }

    stdin.on("data", dataListener)
  })
}
