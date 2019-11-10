const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))


app.get('/', (req, res) => {
  res.render('home')
})
app.get('/soma', (req, res) => {
  const a = parseInt(req.query.a)
  const b = parseInt(req.query.b)
  const soma = a + b
  
  res.send(`<h1> soma = ${soma}.</h1>`)
})

app.listen(3000)