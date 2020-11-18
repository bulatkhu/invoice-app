const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const _ = require('lodash')
const app = express()
const POST = 3001
const sendMail = require('./emailHandler')


app.use(fileUpload({createParentPath: true}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))

app.get('/sendfile', (req, res) => {
  res.json({
    message: true
  })
})

app.post('/sendfile', (req, res) => {

  try {
    if (!req.files.file) {
      return res.json({
        status: false,
        response: 'No file uploaded',
        isSent: false,
      })
    }

    const {file} = req.files

    sendMail({file, ...req.body})
      .then(data => {
        return res.json({...req.body, isSent: true, response: data})
      })
      .catch(err => {
        const error = JSON.parse(JSON.stringify(err))
        console.log('err', error.response)
        return res.json({...req.body, file, isSent: false, response: error.response})
      })
  } catch (e) {
    res.status(500).json({
      status: false,
      response: e,
      isSent: false,
    })
  }

})


app.listen(POST, () => {
  console.log(`Server has been started on port ${POST}`)
})

