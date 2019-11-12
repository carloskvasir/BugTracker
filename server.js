const express = require('express')
const GoogleSpreadSheet = require('google-spreadsheet')
const path = require('path')
const { promisify } = require('util')

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

app.post('/', async (req, res) => {
  try {
    const { name, email, issueType, howToReproduce, expectedOutput } = req.body;

    const doc = new GoogleSpreadSheet(docId)
    promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta.')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({
      name,
      email,
      issueType,
      howToReproduce,
      expectedOutput,
    })
    return res.send('Bug reportado com sucesso.')
  } catch (err) {
    response.send('Erro ao enviar formulário.')
    console.log(err)
  }
})

app.listen(3000)
