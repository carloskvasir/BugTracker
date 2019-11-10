const express = require('express')
const app = express()

)
app.get('/', (req, res) => {
  res.send('Ok: ok')
})
app.get('/soma', (req, res) => {
  const a = parseInt(req.query.a)
  const b = parseInt(req.query.b)
  const soma = a + b
  
  res.send(`<h1> soma = ${soma}.</h1>`)
})

app.listen(3000)