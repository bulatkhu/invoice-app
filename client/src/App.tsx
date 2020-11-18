import React, {useState} from 'react'
import Navbar from './components/Navbar'
import UploadFile from './components/UploadFile'
import CustomerList from './components/CustomerList'
import './App.css'

function App(): any {
  const [customers, setCustomers] = useState([])

  return (
    <div className="App bg-light">

      <Navbar/>

      <div className="App-body container pt-3">

        <UploadFile onUpload={setCustomers}/>

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
