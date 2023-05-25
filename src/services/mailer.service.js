const nodemailer = require('nodemailer');
const config = require('config');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.get('MAIL_HOST'),
  port: config.get('MAIL_PORT'),
  secure: true, // use SSL
  auth: {
    user: config.get('MAIL_USER'),
    pass: config.get('MAIL_PASS')
  }
});

// Send an email using the transporter
async function sendMail(mail) {
  try {
    const info = await transporter.sendMail(mail);
    console.log(`Message sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Error occurred while sending email: ${error.message}`);
  }
}

module.exports = { sendMail };
