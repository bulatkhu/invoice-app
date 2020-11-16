import React, {useEffect, useState} from 'react'
import {isCSVFile, csvToJSON} from '../scripts/csvFiles'

interface UploadFileProps {
  onUpload(array): void
}

const UploadFile: React.FC<UploadFileProps> = props => {
  const [fileDescr, setFileDescr] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [fileResult, setFileResult] = useState(null)
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    if (fileResult) {
      setCustomers(csvToJSON(fileResult))
    }
  },[fileResult])

  useEffect(() => {

    if (customers.length) {
      // const updatedCustomers = customers.map((item, index) => {
      //   item.lastDay = ''
      //   item.invoiceNum = ''
      //   item.message = ''
      //   return item
      // })

      props.onUpload(customers)
    }

  },[customers, props])


  const onUpload = (event: {target: HTMLInputElement}) => {
    if (!event.target.files.length) return
    const file = event.target.files[0]

    if (!isCSVFile(file)) {
      setFileError('File type does not match csv')
    } else {
      setFileError(null)
      setFileDescr(true)
      const reader = new FileReader()
      reader.onload = function () {
        setFileResult(reader.result)
      }
      reader.readAsBinaryString(file)

      // fs.createReadStream(file)
      //   .pipe(csv())

    }

  }

  return (
    <div className="custom-file">
      <input onChange={onUpload} type="file" className="custom-file-input" id="customFile"/>
      <label className="custom-file-label" htmlFor="customFile">Choose file</label>
      {
        fileError
          ? <div className="invalid-feedback d-block">
              {fileError}
            </div>
          : fileDescr
            ? <div className="valid-feedback d-block">
                Looks good!
              </div>
            : null
      }
    </div>
  )
}

export default UploadFile
