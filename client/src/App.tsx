import React, {useState} from 'react'
import Navbar from './components/Navbar'
import UploadFile from './components/UploadFile'
import CustomerList from './components/CustomerList'
import {docCreator} from './scripts/genDocx'
import {saveAs} from 'file-saver'
import './App.css'


// interface Provider {
//   type: any;
// }

function App(): any {
  const [customers, setCustomers] = useState([])

  async function onGenDocFile() {
    const file = await docCreator()
    console.log('file:', file)
    saveAs(file, 'filename.doc')
  }


  return (
    <div className="App bg-light">

      <Navbar/>

      <div className="App-body container pt-3">

        <UploadFile onUpload={setCustomers}/>

        <button onClick={onGenDocFile}>Generate doc file</button>

        {
          customers.length
            ? <CustomerList customers={customers}/>
            : null
        }


      </div>
    </div>
  )
}

export default App
