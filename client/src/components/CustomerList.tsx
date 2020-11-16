import React, {useState} from 'react'
import InputMask from 'react-input-mask'
import {genInvoiceNum} from '../scripts/genInvoiceNum'


interface CustomerListProps {
  customers: any[],
}


const CustomerList: React.FC<CustomerListProps> = props => {
  const initialCustomers = addFieldCustomers(props.customers)
  const [customers, setCustomers] = useState(initialCustomers)

  function addFieldCustomers(customers: any[]) {
    return customers.map((item, index) => {

      if (!item.lastDay) {
        item.lastDay = ''
      }
      if (!item.invoiceNum) {
        item.invoiceNum = ''
      }
      if (!item.message) {
        item.message = ''
      }
      if (!item.refNum) {
        item.refNum = ''
      }
      return item
    })
  }

  function onInputChange(value, colId, field) {
    if (!value.trim()) return

    if (field === 'lastDay') {
      if (!value.toString().includes('_')) {
        return setCustomers(prevState => {
          const refNumVal = value.substring(0, 2) + value.substring(3, 5)
          prevState[colId][field] = value
          prevState[colId].refNum = genInvoiceNum(refNumVal, colId + 1)
          return [
            ...prevState
          ]
        })
      } else {
        setCustomers(prevState => {
          prevState[colId][field] = value
          prevState[colId].refNum = ''
          return [
            ...prevState
          ]
        })
      }
    }


    setCustomers(prevState => {
      prevState[colId][field] = value
      return [
        ...prevState
      ]
    })
  }

  const headTabList = Object
    .keys(customers[0])
    .map((item, index) => {
      const dataField = item

      if (item === 'invoiceNum') {
        item = 'Tilinumero'
      } else if (item === 'lastDay') {
        item = 'Eräpäivä'
      } else if (item === 'message') {
        item = 'Laskun viesti'
      } else if (item === 'refNum') {
        item = 'Viitenumero'
      }

      return (
        <th data-field={dataField} key={index} scope="col">{item}</th>
      )
    })


  const bodyTabList = customers.map((itemObj, indexOfCol) => {
    const key = Object.keys(itemObj)
    return Object.values(itemObj).map((item, index) => (
      <td data-id={index} data-field={key[index]} key={index}>
        <div>
          {
            key[index] !== 'lastDay'
              ? key[index] === 'refNum'
              ? <span className="list__item">{item}</span>

              : <input
                onChange={event => onInputChange(event.target.value, indexOfCol, key[index])}
                data-field={key[index]}
                type="text"
                defaultValue={item.toString()}
              />
              : <InputMask
                mask="99.99.9999"
                type="text"
                onChange={event => onInputChange(event.target.value, indexOfCol, key[index])}
                data-field={key[index]}
                defaultValue={item.toString()}
                // onChange={onChangeInput}
                placeholder="PP.KK.VVVV"
              />
          }
        </div>
      </td>
    ))
  })

  return (
    <div className="table__wrapper">
      <table className="table table-dark">
        <thead className="thead-dark">
        <tr>
          {headTabList}
        </tr>
        </thead>
        <tbody className="customerList__tbody">
        {bodyTabList.map((item, index) => {
          return <tr key={index} data-field-id={index}>{item}</tr>
        })}
        </tbody>
      </table>
    </div>
  )
}


export default CustomerList
