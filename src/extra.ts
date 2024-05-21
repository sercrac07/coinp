import { stdout } from 'node:process'

import { Colors, Symbols } from './lib/consts'
import { getLargestStringLength } from './lib/arrays'

const regex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')
const regexTitle = new RegExp(`.{1,${stdout.columns - 6}}`, 'g')

/** The intro function allows you to display an introductory message with embellished information at the beginning of an application or section. */
export function intro(title: string, ...message: string[]): void {
  const splittedTitle = title.trim().match(regexTitle)!

  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])

  if (message.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.TopLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen}`).join('\n')}\n${Symbols.LineVertical}\n${Symbols.LineVertical + Colors.Reset}\n`)
  else {
    stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.TopLeftCorner : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen} ${index === 0 ? Symbols.LineHorizontal.repeat(largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(largestString - ttl.length) + Symbols.LineVertical}`).join('')}\n`)

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(largestString + 2, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 4) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
  }
}

/** The outro function is used to present a concluding message with additional details at the end of an application or section. It serves to summarize key points and provide closure to user interactions. */
export function outro(title: string, ...message: string[]): void {
  const splittedTitle = title.trim().match(regexTitle)!

  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])

  if (message.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.BottomLeftCorner : ' '} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen}`).join('\n')}${Colors.Reset}\n`)
  else {
    stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.MiddleLine : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen} ${index === 0 ? Symbols.LineHorizontal.repeat(largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(largestString - ttl.length) + Symbols.LineVertical}`).join('')}\n`)

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(largestString + 2, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.BottomLeftCorner + Symbols.LineHorizontal.repeat(largestString + 4) + Symbols.BottomRightCorner + Colors.Reset}\n`)
  }
}

/** The info function enables the presentation of informational messages with enriched content throughout the application. This function is versatile and can be utilized to provide users with relevant information or instructions at various stages of their interaction. */
export function info(title: string, ...message: string[]): void {
  const splittedTitle = title.trim().match(regexTitle)!

  const splittedMessage = message.map(mes => mes.trim().match(regex)!)
  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])

  if (message.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.MiddleLine : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen}`).join('\n')}\n${Symbols.LineVertical}\n${Symbols.LineVertical + Colors.Reset}\n`)
  else {
    stdout.write(`${splittedTitle.map((ttl, index) => `${Colors.FgGreen}${index === 0 ? Symbols.MiddleLine : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + Colors.FgGreen} ${index === 0 ? Symbols.LineHorizontal.repeat(largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(largestString - ttl.length) + Symbols.LineVertical}`).join('')}\n`)

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(largestString + 2, ' ') + Colors.Reset} ${Colors.FgGreen + Symbols.LineVertical}`).join('')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(largestString + 4) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
  }
}
