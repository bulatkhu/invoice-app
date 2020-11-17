import React, {useState} from 'react'
// eslint-disable-next-line
import {saveAs} from 'file-saver'
import mammoth from 'mammoth'
import Navbar from './components/Navbar'
import UploadFile from './components/UploadFile'
import CustomerList from './components/CustomerList'
import {docCreator} from './scripts/genDocx'
import './App.css'


// interface Provider {
//   type: any;
// }

function App(): any {
  const [customers, setCustomers] = useState([])
  const [docArea, setDocArea] = useState({value: null, buffer: null})

  function callback(arrayBuffer) {
    mammoth.convertToHtml({arrayBuffer: arrayBuffer})
      .then((file) => {
        setDocArea(prevState => ({
          buffer: prevState.buffer, value: file.value //
        }))
      })
      .done()
  }


  async function onGenDocFile() {
    const file = await docCreator()
    // console.log('file:', file)
    setDocArea(prevState => ({
      value: prevState.value, buffer: file
    }))

    const reader = new FileReader();

    reader.onload = function(loadEvent) {
      console.log('loadEvent', loadEvent)
      const arrayBuffer = loadEvent.target.result;
      callback(arrayBuffer);
    };

    reader.readAsArrayBuffer(file)


    // mammoth
    //   .convertToHtml({ arrayBuffer: file })
    //   .then(function(result){
    //     console.log(result)
    //   })

    // docToHTML(file, {
    //   container: docArea.current
    // }).then(function(html){ html.toString() })
  }


  return (
    <div className="App bg-light">

      <Navbar/>

      <div className="App-body container pt-3">

        <UploadFile onUpload={setCustomers}/>

        <button onClick={onGenDocFile}>Generate doc file</button>
        {
          docArea.buffer && (
            <button onClick={() => saveAs(docArea.buffer, 'filename.doc')}>Download doc</button>
          )
        }


        {docArea.value && (
          <div dangerouslySetInnerHTML={{__html: docArea.value}}/>
        )}

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
