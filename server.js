const express = require('express')
const GoogleSpreadSheet = require('google-spreadsheet')
const path = require('path')

const credentials = require('./config/google_api.json')
const app = express()

//config
const docId = '18j-MVe4BQcW_MAwBVcoTFbmwcBh2Hon-yTRzn808HLw'
const worksheetIndex = 0

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/', (req, res) => {
  const {name, email} = req.body;

  if( !name || !email){
    return res.status(401).send("Faltando dados...")
  }

  const doc = new GoogleSpreadSheet(docId)
  doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
      console.log('Não foi possivel abrir a planilha.')
    } else {
      console.log('Planilha aberta.')
      doc.getInfo((err, info) => {
        const worksheet = info.worksheets[ worksheetIndex ]
        worksheet.addRow({ name, email }, (err) => {
          if (!err) {
            return res.send('Bug reportado com sucesso.')
          }
        })
      })
    }
  })
})
app.listen(3000)