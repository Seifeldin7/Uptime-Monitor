const mongoose = require('mongoose');
const { NotificationMethod } = require('./notification.method.model');

const webhookNotificationSchema = new mongoose.Schema({});

webhookNotificationSchema.methods.notify = async function(check, status) {
  if (this.enabled) {
    await axios.post(check.webhook, {
      check,
      status
    });
  }
};

const WebhookNotification = NotificationMethod.discriminator(
  'WebhookNotification',
  webhookNotificationSchema
);

module.exports = { WebhookNotification };
