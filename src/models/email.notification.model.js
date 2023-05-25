const mongoose = require('mongoose');
const { NotificationMethod } = require('./notification.method.model');
const { emailService } = require('../services');

const emailNotificationSchema = new mongoose.Schema({});

emailNotificationSchema.methods.notify = async function(check, status) {
  if (this.enabled) {
    // send the email notification
    await emailService.sendMail({
      to: check.user.email,
      subject: 'Uptime Alert',
      text: 'Your site is down!'
    });
  }
};

const EmailNotification = NotificationMethod.discriminator(
  'EmailNotification',
  emailNotificationSchema
);

module.exports = { EmailNotification };
