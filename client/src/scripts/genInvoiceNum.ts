function roundToNearestTen(number: number) {
  return Math.ceil(number / 10) * 10
}

export function genInvoiceNum(startValue: string, id: number) {
  const value = startValue+id.toString()
  let sum = 0
  const characters = value
    .split('')
    .map(item => +item)
  characters
    .reverse()
    .forEach((item, index) => {

      if (index % 3 === 0) {
        sum += item * 7
      } else if (index % 3 === 1) {
        sum += item * 3
      } else if (index % 3 === 2) {
        sum += item
      }

    })

  const proofNum = roundToNearestTen(sum) - sum
  return value + proofNum
}
