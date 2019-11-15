const express = require('express')
const GoogleSpreadSheet = require('google-spreadsheet')
const path = require('path')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const credentials = require('./config/google_api.json')
const sendgrid_key = require('./config/sendgrid.json')
sgMail.setApiKey(sendgrid_key.SENDGRID_API_KEY)

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
    const {
      name,
      email,
      issueType,
      howToReproduce,
      expectedOutput,
      userAgent,
      userDate
    } = req.body;

    const doc = new GoogleSpreadSheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Planilha aberta.')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({
      name,
      email,
      issueType,
      howToReproduce,
      expectedOutput,
      userAgent,
      userDate
    })

    // se for critico mandar email
    if (issueType === 'CRITICAL') {
      const msg = {
        to: 'span.carloslimajr.eng@gmail.com',
        from: 'span.carloslimajr.eng@gmail.com',
        subject: 'Um Bug critíco foi notificado',
        text: `O usúario ${name} reportou um problema.`,
        html: `<h2>O usúario ${name} reportou um problema.</h2>`,
      };
      await sgMail.send(msg);
    }

    return res.send('Bug reportado com sucesso.')
  } catch (err) {
    console.log(err)

    return res.send('Erro ao enviar formulário.')
  }
})

app.listen(3000)
