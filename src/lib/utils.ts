// Clears the ANSI escape codes from a string
export function clearString(str: string): string {
  const regex = /\\x1b\[[0-9;]*m/g
  return str.replace(regex, "")
}

// Splits a string into two parts, one with ANSI escape codes and the other without
export function splitHeight(normal: string, ansi: string, length: number = 10): { normal: string[]; ansi: string[] } {
  const fragmentLength = length
  const normalResult: string[] = []
  const ansiResult: string[] = []

  let normalIndex = 0
  let ansiIndex = 0
  let cleanAnsiLength = 0

  while (normalIndex < normal.length) {
    // Obtain the fragment normal
    const fragmentoNormal = normal.slice(normalIndex, normalIndex + fragmentLength)
    normalResult.push(fragmentoNormal)

    let fragmentoAnsi = ""
    cleanAnsiLength = 0

    while (cleanAnsiLength < fragmentLength && ansiIndex < ansi.length) {
      const charAnsi = ansi[ansiIndex]
      fragmentoAnsi += charAnsi

      // Detect the start of an ANSI escape sequence
      if (charAnsi === "\x1b") {
        // Continue until the end of the ANSI escape sequence
        while (ansiIndex < ansi.length && ansi[ansiIndex] !== "m") {
          ansiIndex++
          fragmentoAnsi += ansi[ansiIndex]
        }
      } else {
        cleanAnsiLength++
      }

      ansiIndex++
    }

    ansiResult.push(fragmentoAnsi)
    normalIndex += fragmentLength
  }

  return {
    normal: normalResult,
    ansi: ansiResult
  }
}

// Splits a string into two parts, one with ANSI escape codes and the other without
export function splitWidth(str: string, length: number = 10): string {
  if (str.length <= length) {
    return str
  }
  return "..." + str.slice(-length + 3)
}

// Splits an array into two parts, one with the first maxLength elements and the other with the remaining elements
export function splitArray(array: string[], maxLength: number, upPositions: number): string[] {
  // Check if the array is shorter than the max length
  if (array.length <= maxLength) {
    return array
  }

  // Get the first upPositions elements from the array
  const upPositionsArray = array.slice(0, upPositions)

  // Calculate the number of positions below the max length
  const posicionesAbajo = maxLength - upPositions

  // Get the last posicionesAbajo elements from the array
  const posicionesAbajoArray = array.slice(-posicionesAbajo)

  // Add "..." to the first element of the array if it's longer than maxLength
  if (posicionesAbajoArray.length > 0) {
    posicionesAbajoArray[0] = "..." + posicionesAbajoArray[0].slice(3)
  }

  // Concatenate the upPositionsArray and posicionesAbajoArray
  return [...upPositionsArray, ...posicionesAbajoArray]
}
