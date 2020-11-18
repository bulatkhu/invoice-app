import {saveAs} from 'file-saver'


export const onGenerateResults = customers => {
  const keys = getKeys(customers)
  const result = [keys]

  customers.forEach(item => {
    result.push(Object.values(item))
  })

  const string = result
    .map(row => row.map(value => value.toString()))
    .map(row => row.join(';'))
    .join('\n')

  let csvData = new Blob([string], { type: 'text/csv' })

  saveAs(csvData, 'csvResults.csv')
}

function getKeys(customers) {
  const keys = []

  customers.forEach(itemForEach => {

    Object.keys(itemForEach).forEach(key => {
      if (!keys.find(keyItem => keyItem === key)) {
        keys.push(key)
      }
    })

  })

  return keys
}
