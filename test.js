const GoogleSpreadSheet = require('google-spreadsheet');
const credentials = require('./bugtracker.json');
const { promisify } = require('util');

const addRowToSheet = async () => {
  const doc = new GoogleSpreadSheet(process.env.DOC_ID);
  await promisify(doc.useServiceAccountAuth)(credentials);
  console.log('planilha aberta');
  const info = await promisify(doc.getInfo)();
  const worksheet = info.worksheets[0];
  await promisify(worksheet.addRow)({ name: 'Mario', email: 'mcs@gmail.com' });
};

addRowToSheet();

/*
const doc = new GoogleSpreadSheet(
 process.env.DOC_ID
);
doc.useServiceAccountAuth(credentials, err => {
  if (err) {
    console.log('erro');
  } else {
    console.log('planilha aberta');
    doc.getInfo((err, info) => {
      // console.log(info);
      const worksheet = info.worksheets[0];
      worksheet.addRow({ name: 'Mario', email: 'mcs@gmail.com' }, err => {
        console.log('linha inserida');
      });
    });
  }
});
*/
