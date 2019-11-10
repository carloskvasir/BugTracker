const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Ok: ok')
})

app.listen(3000)