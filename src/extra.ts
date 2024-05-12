import { exit, stdin, stdout } from 'node:process'
import { clearScreenDown, moveCursor, cursorTo } from 'node:readline'

import { Colors, Symbols, Unicode } from './lib/consts'
import { getLargestStringLength } from './lib/arrays'

const regex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')

/**
 * The intro function allows you to display an introductory message with embellished information at the beginning of an application or section.
 *
 * ```javascript
 * intro('Hello world')
 * ```
 */
export function intro(...message: string[]) {
  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength(splittedMessage.flatMap(str => str))

  stdout.write(`${Colors.FgGreen + Symbols.TopLeftCorner + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + m.padEnd(largestString, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
}

/**
 * The outro function is used to present a concluding message with additional details at the end of an application or section. It serves to summarize key points and provide closure to user interactions.
 *
 * ```javascript
 * outro('Bye world')
 * ```
 */
export function outro(...message: string[]) {
  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength(splittedMessage.flatMap(str => str))

  stdout.write(`${Colors.FgGreen + Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + m.padEnd(largestString, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.BottomLeftCorner + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.BottomRightCorner + Colors.Reset}\n`)
}

/**
 * The info function enables the presentation of informational messages with enriched content throughout the application. This function is versatile and can be utilized to provide users with relevant information or instructions at various stages of their interaction.
 *
 * ```javascript
 * info('This is an info message')
 * ```
 */
export function info(...message: string[]) {
  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength(splittedMessage.flatMap(str => str))

  stdout.write(`${Colors.FgGreen + Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.TopRightCorner}\n${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.Dim + m.padEnd(largestString, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 2) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
}
