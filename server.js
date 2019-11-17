const express = require('express');
const GoogleSpreadSheet = require('google-spreadsheet');
const path = require('path');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');
const favicon = require('serve-favicon');

const credentials = require('./config/google_api.json');
const sendgridKey = require('./config/sendgrid.json');
const spreadSheetConfig = require('./config/spreadSheetConfigs.json');

sgMail.setApiKey(sendgridKey.SENDGRID_API_KEY);

const app = express();

// Favicon
app.use(favicon(`${__dirname}/views/favicon.png`));
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      issueType,
      howToReproduce,
      expectedOutput,
      userAgent,
      userDate,
    } = req.body;

    const doc = new GoogleSpreadSheet(spreadSheetConfig.docId);
    await promisify(doc.useServiceAccountAuth)(credentials);
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[spreadSheetConfig.worksheetIndex];
    await promisify(worksheet.addRow)({
      name,
      email,
      userAgent,
      issueType,
      howToReproduce,
      expectedOutput,
      userDate,
      source: req.query.source || 'direct',
    });

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

    return res.render('sucess');
  } catch (err) {
    // console.log(err);

    return res.send('Erro ao enviar formulário.');
  }
});

app.listen(3000);
