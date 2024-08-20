import { exit, stdin, stdout } from "node:process"
import { clearScreenDown, moveCursor, cursorTo, clearLine } from "node:readline"

import { Colors, Symbols, Unicode } from "./lib/consts"
import { clearString, splitArray, splitHeight, splitWidth } from "./lib/utils"

interface SelectOptions<T extends string> {
  /** Message to display to the user. */
  message: string
  /** All the options available for the user to choose from. */
  choices: SelectChoice<T>[]
  /** The initial cursor position. */
  cursorAt?: NoInfer<T>
}

interface SelectChoice<T extends string> {
  /** Text to display. */
  label: string
  /** The return value */
  value: T
}

/**
 * The `list` function empowers users to select a single option from a predefined list of choices.
 *
 * [API Reference](https://github.com/sercrac07/coinp?tab=readme-ov-file#coinpselectoptions)
 */
export function select<T extends string>(options: SelectOptions<T>): Promise<T> {
  return new Promise(resolve => {
    // Global variables
    let lastJump = 0
    const splitedTitle = splitHeight(
      clearString(`${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.Dim + ">>" + Colors.Reset}    `),
      `${Colors.FgBlue + Symbols.Unanswered + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.Dim + ">>" + Colors.Reset}    `,
      stdout.columns
    )
    const canBeShown = stdout.rows - splitedTitle.normal.length
    let slicePositions = [0, canBeShown]

    // Reading stdin
    stdin.resume()
    stdin.setEncoding("utf-8")
    stdin.setRawMode(true)

    // Get the initial message
    let userInput = ""
    let showMessage = ""
    let currentPosition = options.choices.findIndex(choice => choice.value === options.cursorAt) === -1 ? 0 : options.choices.findIndex(choice => choice.value === options.cursorAt)

    // Get all the choices that match the search
    let filteredChoices = options.choices.filter(choice => choice.label.toLowerCase().split(" ").join("").includes(userInput.toLowerCase().split(" ").join("")))

    // Update the console with the user input
    const updateConsole = (type: "enter" | "input" | "intro" = "input", extra?: string) => {
      filteredChoices = options.choices.filter(choice => choice.label.toLowerCase().split(" ").join("").includes(userInput.toLowerCase().split(" ").join("")))
      if (slicePositions[1] > filteredChoices.length) slicePositions = [0, canBeShown]

      const filteredAndSlicedChoices = filteredChoices.slice(slicePositions[0], slicePositions[1])

      if (currentPosition > filteredChoices.length - 1 || currentPosition < 0) currentPosition = 0

      const symbol = type === "enter" ? Symbols.Answered : Symbols.Unanswered
      const color = type === "enter" ? Colors.FgGreen : Colors.FgBlue

      showMessage = `${color + symbol + Colors.Reset} ${Colors.Bright + options.message + Colors.Reset} ${Colors.Dim + ">>" + Colors.Reset}    `

      const titleLength = Math.ceil(clearString(showMessage).length / stdout.columns)
      const displayText = splitWidth(userInput, stdout.columns - clearString(splitedTitle.normal.at(-1)!.slice(0, -3)).length)

      if (type !== "intro") {
        // Clean the console depending on the message line height
        if (lastJump === 0) {
          cursorTo(stdout, 0)
          clearLine(stdout, 0)
        } else {
          moveCursor(stdout, 0, lastJump)
          cursorTo(stdout, 0)
          clearScreenDown(stdout)
        }
      }

      if (type === "enter") stdout.write(`${Unicode.ShowCursor + showMessage.slice(0, -3) + Colors.Dim + Colors.FgGreen + filteredChoices.at(currentPosition)!.label + Colors.Reset}`)
      else stdout.write(`${Unicode.HideCursor + splitedTitle.ansi.join("\n").slice(0, -3) + displayText}${filteredChoices.length ? "\n" : ""}`)

      // Display the choices only if the user has not selected an option yet
      if (type !== "enter")
        stdout.write(
          filteredAndSlicedChoices
            .map((choice, index) => {
              const thisIndex = index + slicePositions[0]
              const isSelected = currentPosition === thisIndex
              const isFirst = index === 0
              const isLast = index === filteredAndSlicedChoices.length - 1
              const isDiff = filteredAndSlicedChoices.length !== filteredChoices.length
              return `${isSelected ? Colors.FgBlue + Symbols.RightArrow + Colors.Reset : " "} ${
                isDiff && isFirst ? Colors.FgBlue + Symbols.TopArrow + Colors.Reset : isDiff && isLast ? Colors.FgBlue + Symbols.DownArrow + Colors.Reset : " "
              }   ${isSelected ? Colors.FgBlue + Colors.Underscore : ""}${choice.label + Colors.Reset}`
            })
            .join("\n")
        )

      lastJump = (filteredAndSlicedChoices.length + titleLength - 1) * -1
    }

    updateConsole("intro")

    const dataListener = (data: Buffer) => {
      // Get the key pressed
      const key = data.toString()
      const exitKey = key === Unicode.ControlC || key === Unicode.Esc
      const enterKey = key === Unicode.Enter
      const backspaceKey = Unicode.Backspace.includes(key as any)
      const controlBackspaceKey = key === Unicode.ControlBackspace
      const arrowKey = key === Unicode.UpArrow || key === Unicode.DownArrow || key === Unicode.LeftArrow || key === Unicode.RightArrow

      // Checks the key pressed
      if (exitKey) {
        stdout.write(Unicode.ShowCursor)
        stdin.removeListener("data", dataListener)
        exit()
      } else if (backspaceKey) {
        userInput = userInput.slice(0, -1)
        updateConsole()
      } else if (controlBackspaceKey) {
        userInput = userInput.split(" ").slice(0, -1).join(" ")
        updateConsole()
      } else if (enterKey) {
        if (filteredChoices.length === 0) return
        updateConsole("enter")
        stdout.write("\n")
        stdin.removeListener("data", dataListener)
        stdin.pause()
        resolve(filteredChoices.at(currentPosition)!.value)
      } else if (arrowKey) {
        if (key === Unicode.UpArrow) {
          if (currentPosition === 0) {
            currentPosition = filteredChoices.length - 1
            if (canBeShown >= filteredChoices.length) return updateConsole()
            slicePositions = [filteredChoices.length - canBeShown, filteredChoices.length]
          } else currentPosition--
          if (canBeShown >= filteredChoices.length) return updateConsole()
          if (currentPosition < slicePositions[0]) {
            if (currentPosition === filteredChoices.length - 1) return updateConsole()
            slicePositions[0]--
            slicePositions[1]--
          }
        } else if (key === Unicode.DownArrow) {
          if (currentPosition === filteredChoices.length - 1) {
            currentPosition = 0
            slicePositions = [0, canBeShown]
          } else currentPosition++
          if (canBeShown >= filteredChoices.length) return updateConsole()
          if (currentPosition >= slicePositions[1]) {
            if (currentPosition === filteredChoices.length) return updateConsole()
            slicePositions[0]++
            slicePositions[1]++
          }
        } else if (key === Unicode.LeftArrow) currentPosition = 0
        else if (key === Unicode.RightArrow) currentPosition = filteredChoices.length - 1
        updateConsole()
      } else {
        userInput += key
        updateConsole()
      }
    }

    stdin.on("data", dataListener)
  })
}
