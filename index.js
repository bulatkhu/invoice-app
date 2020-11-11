const express = require('express')
const app = express()
const POST = 3001




app.listen(POST, () => {
  console.log(`Server has been started on port ${POST}`)
})
