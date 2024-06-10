import { stdout } from 'node:process'

import { Colors, Symbols } from './lib/consts'
import { getLargestStringLength } from './lib/arrays'

const regex = new RegExp(`.{1,${stdout.columns - 4}}`, 'g')
const regexTitle = new RegExp(`.{1,${stdout.columns - 6}}`, 'g')

type InfoType = 'error' | 'info'

interface InfoOptions {
  title: string
  message?: string[]
  type?: InfoType
}

/** The intro function allows you to display an introductory message with embellished information at the beginning of an application or section. */
export function intro(title: string, ...message: string[]): void
export function intro(options: InfoOptions): void
export function intro(options: InfoOptions | string, ...message: string[]): void {
  let title: string
  if (typeof options === 'string') title = options
  else title = options.title

  let messages: string[]
  if (typeof options === 'string') messages = message
  else messages = options.message ?? []

  const type = typeof options === 'string' ? 'info' : options.type ?? 'info'

  const col = type === 'error' ? Colors.FgRed : Colors.FgGreen
  const symb = type === 'error' ? Symbols.Error : Symbols.Answered

  const splittedTitle = title.trim().match(regexTitle)!
  const splittedMessage = messages.map(mes => mes.trim().match(regex)!)

  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])
  const [titleLength, messageLength] = [getLargestStringLength(splittedTitle), getLargestStringLength(splittedMessage.flatMap(str => str))]

  if (messages.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${col}${index === 0 ? symb : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col}`).join('\n')}\n${Symbols.LineVertical}\n${Symbols.LineVertical + Colors.Reset}\n`)
  else {
    let extra = 0

    stdout.write(
      `${splittedTitle
        .map((ttl, index) => {
          extra = largestString - ttl.length - 2 === -1 ? 1 : 0
          return `${col}${index === 0 ? symb : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col} ${index === 0 ? Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.LineVertical}`
        })
        .join('\n')}\n`
    )

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(messageLength > titleLength ? largestString + extra : largestString + 2, ' ') + Colors.Reset} ${col + Symbols.LineVertical}`).join('\n')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString + 2 + extra : largestString + 4) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
  }
}

/** The outro function is used to present a concluding message with additional details at the end of an application or section. It serves to summarize key points and provide closure to user interactions. */
export function outro(title: string, ...message: string[]): void
export function outro(options: InfoOptions): void
export function outro(options: InfoOptions | string, ...message: string[]): void {
  let title: string
  if (typeof options === 'string') title = options
  else title = options.title

  let messages: string[]
  if (typeof options === 'string') messages = message
  else messages = options.message ?? []

  const type = typeof options === 'string' ? 'info' : options.type ?? 'info'

  const col = type === 'error' ? Colors.FgRed : Colors.FgGreen
  const symb = type === 'error' ? Symbols.Error : Symbols.Answered

  const splittedTitle = title.trim().match(regexTitle)!
  const splittedMessage = messages.map(mes => mes.trim().match(regex)!)

  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])
  const [titleLength, messageLength] = [getLargestStringLength(splittedTitle), getLargestStringLength(splittedMessage.flatMap(str => str))]

  if (messages.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${col}${index === 0 ? symb : ' '} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col}`).join('\n')}${Colors.Reset}\n`)
  else {
    let extra = 0

    stdout.write(
      `${splittedTitle
        .map((ttl, index) => {
          extra = largestString - ttl.length - 2 === -1 ? 1 : 0
          return `${col}${index === 0 ? symb : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col} ${index === 0 ? Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.LineVertical}`
        })
        .join('\n')}\n`
    )

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(messageLength > titleLength ? largestString + extra : largestString + 2, ' ') + Colors.Reset} ${col + Symbols.LineVertical}`).join('\n')).join('\n')}\n${Symbols.BottomLeftCorner + Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString + 2 + extra : largestString + 4) + Symbols.BottomRightCorner + Colors.Reset}\n`)
  }
}

/** The info function enables the presentation of informational messages with enriched content throughout the application. This function is versatile and can be utilized to provide users with relevant information or instructions at various stages of their interaction. */
export function info(title: string, ...message: string[]): void
export function info(options: InfoOptions): void
export function info(options: InfoOptions | string, ...message: string[]): void {
  let title: string
  if (typeof options === 'string') title = options
  else title = options.title

  let messages: string[]
  if (typeof options === 'string') messages = message
  else messages = options.message ?? []

  const type = typeof options === 'string' ? 'info' : options.type ?? 'info'

  const col = type === 'error' ? Colors.FgRed : Colors.FgGreen
  const symb = type === 'error' ? Symbols.Error : Symbols.Answered

  const splittedTitle = title.trim().match(regexTitle)!
  const splittedMessage = messages.map(mes => mes.trim().match(regex)!)

  const largestString = getLargestStringLength([...splittedMessage.flatMap(str => str), ...splittedTitle])
  const [titleLength, messageLength] = [getLargestStringLength(splittedTitle), getLargestStringLength(splittedMessage.flatMap(str => str))]

  if (messages.length === 0) stdout.write(`${splittedTitle.map((ttl, index) => `${col}${index === 0 ? symb : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col}`).join('\n')}\n${Symbols.LineVertical}\n${Symbols.LineVertical + Colors.Reset}\n`)
  else {
    let extra = 0
    stdout.write(
      `${splittedTitle
        .map((ttl, index) => {
          extra = largestString - ttl.length - 2 === -1 ? 1 : 0
          return `${col}${index === 0 ? symb : Symbols.LineVertical} ${Colors.Reset + Colors.Reverse} ${ttl} ${Colors.Reset + col} ${index === 0 ? Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.TopRightCorner : ' '.repeat(messageLength > titleLength ? largestString - ttl.length - 2 + extra : largestString - ttl.length) + Symbols.LineVertical}`
        })
        .join('\n')}\n`
    )

    stdout.write(`${splittedMessage.map(msg => msg.map(m => `${Symbols.LineVertical + Colors.Reset} ${Colors.FgGray + m.padEnd(messageLength > titleLength ? largestString + extra : largestString + 2, ' ') + Colors.Reset} ${col + Symbols.LineVertical}`).join('\n')).join('\n')}\n${Symbols.MiddleLine + Symbols.LineHorizontal.repeat(messageLength > titleLength ? largestString + 2 + extra : largestString + 4) + Symbols.BottomRightCorner}\n${Symbols.LineVertical + Colors.Reset}\n`)
  }
}
