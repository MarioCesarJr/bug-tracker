require('dotenv').config();
const express = require('express');
const path = require('path');
const { promisify } = require('util');
const sgMail = require('@sendgrid/mail');

const GoogleSpreadSheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');

const app = express();

const worksheetIndex = 0;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/', async (req, res) => {
  try {
    const doc = new GoogleSpreadSheet(process.env.DOC_ID);
    await promisify(doc.useServiceAccountAuth)(credentials);
    const info = await promisify(doc.getInfo)();
    const worksheet = info.worksheets[worksheetIndex];
    await promisify(worksheet.addRow)({
      name: req.body.name,
      email: req.body.email,
      userAgent: req.body.userAgent,
      userDate: req.body.userDate,
      issueType: req.body.issueType,
      source: req.query.source || 'direct'
    });

    if (req.body.issueType === 'CRITICAL') {
      sgMail.setApiKey(process.env.SEND_GRID_KEY);
      const msg = {
        to: 'mcsjuniorsouza@gmail.com',
        from: req.body.email,
        subject: 'Bug crítivo reportado',
        text: `O usuário ${req.body.name} reportou um problema`,
        html: '<strong>Bug detected</strong>'
      };
      await sgMail.send(msg);
    }

    res.render('success');
  } catch (err) {
    res.send('Erro ao enviar formulário');
    console.log(err);
  }
});

app.listen(3333, err => {
  if (err) {
    console.log('Aconteceu um erro', err);
  } else {
    console.log('BugTracker running...');
  }
});
