export function sumAllNumbers(arr: number[]): number {
  let totalNum = 0

  arr.forEach(num => (totalNum += num))

  return totalNum
}

export function getLargestStringLength(arr: string[]): number {
  let length = 0

  arr.forEach(str => {
    if (str.length > length) length = str.length
  })

  return length
}
