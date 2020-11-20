const nodemailer = require('nodemailer')
// require('dotenv').config()

module.exports = async function sendMail({file, message, name, lastname, email}) {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  return transporter.sendMail({
    from: 'Omnian ammattiopisto', // sender address
    to: email, // list of receivers
    subject: 'Lasku', // Subject line
    text: message, // plain text body
    html: `
      <h4>Se on itse generoitu viesti saajalle: ${name} ${lastname}</h4>
      <p>${message}</p>
    `, // html body
    attachments: [
      {
        filename: `lasku-${name}-${lastname}.doc`,
        content: Buffer.from(file.data, 'base64'),
      }
    ]
  })
}
