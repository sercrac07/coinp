import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'

const regex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')

export function intro(message: string) {
  const splittedMessage = message.match(regex)!

  stdout.write(`${Colors.FgGreen + Symbols.TopLeftCorner + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + msg.padEnd(stdout.columns - 4, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
}

export function outro(message: string) {
  const splittedMessage = message.match(regex)!

  stdout.write(`${Colors.FgGreen + Symbols.MiddleLine + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + msg.padEnd(stdout.columns - 4, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')}\n${Symbols.BottomLeftCorner + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.BottomRightCorner + Colors.Reset}\n`)
}

export function info(message: string) {
  const splittedMessage = message.match(regex)!

  stdout.write(`${Colors.FgGreen + Symbols.MiddleLine + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + msg.padEnd(stdout.columns - 4, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(splittedMessage[0].length + 2) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
}
