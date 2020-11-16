export function filterStr(string) {
  return string.toString().replace('\r', '')
}

export function isCSVFile(file) {
  const name = file.name.toString()
  return name.substr(name.length - 3) === 'csv'
}

export function csvToJSON(csvText) {
  let toDelete = null
  const array = csvText
    .split('\n')
    .map(item => item.split(';'))
  array.forEach((item, index) => {
    if (item.length === 1 && item[0] === "") {
      toDelete = index
    }
  })

  if (toDelete) {
    array.splice(toDelete, 1)
  }

  const firstLine = array[0]
  const object = array
    .filter((item, index) => index !== 0)
    .map((item, index )=> {
      const object1 = {}
      item.forEach((item1, index1) => {
        let key = filterStr([firstLine[index1]])
        object1[key] = filterStr(item1)
      })

      return object1
    })

  return object
}
