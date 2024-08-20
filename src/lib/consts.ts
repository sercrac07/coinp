export const Unicode = {
  ControlC: "\x03",
  Esc: "\x1B",

  Enter: "\r",
  Backspace: ["\b", "\x7F"],
  ControlBackspace: "\x17",
  Spacebar: "\u0020",
  Tab: "\t",
  AltS: "\x1Bs",

  UpArrow: "\x1B[A",
  DownArrow: "\x1B[B",
  RightArrow: "\x1B[C",
  LeftArrow: "\x1B[D",

  HideCursor: "\u001B[?25l",
  ShowCursor: "\u001B[?25h"
} as const

/** All symbols used in the package. */
export const Symbols = {
  LineHorizontal: "─",
  LineVertical: "│",
  MiddleLine: "├",

  TopLeftCorner: "┌",
  TopRightCorner: "┐",

  BottomLeftCorner: "└",
  BottomRightCorner: "┘",

  RightArrow: "▶",
  TopArrow: "▲",
  DownArrow: "▼",

  Unselected: "□",
  Selected: "■",

  Load: ["◓", "◑", "◒", "◐"],

  Unanswered: "◇",
  Answered: "◆",
  Error: "▲"
} as const

/** Colors for customization. */
export const Colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[90m\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  FgGray: "\x1b[90m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
  BgGray: "\x1b[100m"
} as const
