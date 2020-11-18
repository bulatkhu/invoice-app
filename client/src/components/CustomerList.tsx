import React, {useEffect, useState} from 'react'
import InputMask from 'react-input-mask'
import {saveAs} from 'file-saver'
import axios from 'axios'
import {genInvoiceNum} from '../scripts/genInvoiceNum'
import {docCreator} from '../scripts/genDocx'
import {onGenerateResults} from '../scripts/generateResults'

interface CustomerListProps {
  customers: any[],
}

function keysToLowerCase(customer) {
  const newObject = {}
  const keys = Object.keys(customer)
  keys.forEach(item => {
    let key = item.toString().toLowerCase()
    if (key === 'docx') return
    if (key === 'lastday') {
      key = 'eräpäivä'
    }
    if (key === 'invoicenum') {
      key = 'tilinumero'
    }
    if (key === 'refnum') {
      key = 'viitenumero'
    }
    if (key === 'etunimi') {
      key = 'nimi'
    }
    if (key === 'message') {
      key = 'laskunviesti'
    }

    newObject[key] = customer[item]
  })
  return newObject
}


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
    if (!item.sum) {
      item.sum = ''
    }
    if (!item.docx) {
      item.docx = 'docx'
      item.isSent = 'no'
    }
    return item
  })
}

const CustomerList: React.FC<CustomerListProps> = props => {
  const initialCustomers = addFieldCustomers(props.customers)
  const [customers, setCustomers] = useState(initialCustomers)
  // eslint-disable-next-line
  const [showDocxInfo, setShowDocxInfo] = useState([])

  useEffect(() => {

    const idArray = []

    customers.forEach((item, index) => {
      const keys = Object.keys(item)
      const values = []
      keys.forEach(key => {
        if (!item[key]) {
          values.push(true)
        }
      })
      idArray.push(!values.length)
    })

    setShowDocxInfo(idArray)

  }, [customers])

  async function onClickGenDocx(index, type) {
    const customersObj = keysToLowerCase(customers[index])
    // @ts-ignore
    const file = await new docCreator({...customersObj}).createDoc()

    if (type === 'download') {
      // @ts-ignore
      return saveAs(file, `lasku-${customersObj.nimi}-${customersObj.sukunimi}.doc`)
    } else {

      return {
        file, // @ts-ignore
        email: customersObj.sähköposti, // @ts-ignore
        message: customersObj.laskunviesti, // @ts-ignore
        name: customersObj.nimi, // @ts-ignore
        lastname: customersObj.sukunimi,
      }
    }
  }

  async function onSendFile(index) {
    const customersObj = await onClickGenDocx(index, 'get')
    const {file, email, message, name, lastname} = customersObj

    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)
    formData.append('message', message)
    formData.append('name', name)
    formData.append('lastname', lastname)
    formData.append('index', index)

    axios.post('/sendfile', formData)
      .then(res => {
        if (res.data.isSent) {

          setCustomers(prevState => {

            return prevState.map((item, index) => {

              if (index === +res.data.index) {
                item.isSent = 'yes'
              }
              return item
            })
          })

        } else {
          alert('Something went wrong email has been not sent, check console')
          console.log(res.data)
        }
      })
      .catch(err => {

      })
  }


  function onInputChange(value, colId, field) {
    // if (!value.trim()) return

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
        item = 'Laskuviesti'
      } else if (item === 'refNum') {
        item = 'Viitenumero'
      }

      return (
        <th data-field={dataField} key={index} scope="col">{item}</th>
      )
    })


  const onChangeEverywhere = (value, field) => {
    if (field !== 'lastDay') {
      return setCustomers(prevState => prevState.map(item => ({...item, [field]: value})))
    }

    const refNumVal = value.substring(0, 2) + value.substring(3, 5)

    // setCustomers(prevState => {
    //
    //
    //   return prevState.map(item => {
    //     console.log(item)
    //     return item
    //   })
    // })


    if (!value.toString().includes('_')) {
      return setCustomers(prevState => {
        return prevState.map((item, colId) => {
          item[field] = value
          item.refNum = genInvoiceNum(refNumVal, colId + 1)
          return item
        })
      })
    } else {
      setCustomers(prevState => {
        return prevState.map((item) => {
          item[field] = value
          item.refNum = ''
          return item
        })
      })
    }
  }

  return (
    <>
      <div className="form-group row">
        <label htmlFor="inputAccNumber" className="col-sm-2 col-form-label">Account number:</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="inputAccNumber"
            placeholder="Tilinumero"
            onChange={event => onChangeEverywhere(event.target.value, 'invoiceNum')}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputMessage" className="col-sm-2 col-form-label">Message:</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            id="inputMessage"
            placeholder="Message"
            onChange={event => onChangeEverywhere(event.target.value, 'message')}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputSum" className="col-sm-2 col-form-label">Sum:</label>
        <div className="col-sm-10">
          <input
            type="number"
            className="form-control"
            id="inputSum"
            placeholder="Sum"
            onChange={event => onChangeEverywhere(event.target.value, 'sum')}
          />
        </div>
      </div>
      <div className="form-group row">
        <label htmlFor="inputSum" className="col-sm-2 col-form-label">Due day:</label>
        <div className="col-sm-10">
          <InputMask
            mask="99.99.9999"
            type="text"
            className="form-control"
            // onChange={event => onInputChange(event.target.value, indexOfCol, key[index])}
            onChange={event => onChangeEverywhere(event.target.value, 'lastDay')}
            // onChange={onChangeInput}
            placeholder="PP.KK.VVVV"
          />
        </div>
      </div>
      <div className="form-group">
        <button
          type="button"
          className="btn btn-success"
          onClick={() => onGenerateResults(customers)}
        >Generate and download results of table</button>
      </div>

      <div className="table__wrapper">
        <table className="table table-dark">
          <thead className="thead-dark">
          <tr>
            {headTabList}
          </tr>
          </thead>
          <tbody className="customerList__tbody">
          {customers.map((itemObj, indexOfCol) => {
            const key = Object.keys(itemObj)
            return Object.values(itemObj).map((item, index) => {


              return (
                <td data-id={index} data-field={key[index]} key={index}>
                  <div>
                    {
                      key[index] !== 'lastDay'
                        ? key[index] === 'refNum' || key[index] === 'isSent'
                        ? <span className="list__item">{item}</span>
                        : key[index] === 'docx'
                          ? <>
                            <button
                              disabled={!showDocxInfo[indexOfCol]}
                              type="button"
                              className={['btn', 'btn-sm', !showDocxInfo[indexOfCol] ? 'btn-secondary' : 'btn-primary'].join(' ')}
                              onClick={() => onClickGenDocx(indexOfCol, 'download')}
                            >{item}</button>
                            <button
                              disabled={!showDocxInfo[indexOfCol]}
                              type="button"
                              className={['btn', 'btn-sm', !showDocxInfo[indexOfCol] ? 'btn-secondary' : 'btn-info'].join(' ')}
                              onClick={() => onSendFile(indexOfCol)}
                            >send
                            </button>
                          </>
                          : <input
                            onChange={event => onInputChange(event.target.value, indexOfCol, key[index])}
                            data-field={key[index]}
                            type="text"
                            value={item.toString()}
                          />
                        : <InputMask
                          mask="99.99.9999"
                          type="text"
                          onChange={event => onInputChange(event.target.value, indexOfCol, key[index])}
                          data-field={key[index]}
                          value={item.toString()}
                          placeholder="PP.KK.VVVV"
                        />
                    }
                  </div>
                </td>
              )
            })
          }).map((item, index) => {
            return <tr key={index} data-field-id={index}>{item}</tr>
          })}
          </tbody>
        </table>
      </div>
    </>
  )
}


export default CustomerList
