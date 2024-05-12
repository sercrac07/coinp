export function sumAllNumbers(arr: number[]): number {
  let totalNum = 0

  arr.forEach(num => (totalNum += num))

  return totalNum
}
