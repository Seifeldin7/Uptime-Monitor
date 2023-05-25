const mongoose = require('mongoose');

const notificationMethodSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // this field will be used as the discriminator key
    enabled: { type: Boolean, default: true }
  },
  { discriminatorKey: 'type' }
);

notificationMethodSchema.methods.notify = function(check, status) {
  // This method should be implemented by the child classes
};

const NotificationMethod = mongoose.model(
  'NotificationMethod',
  notificationMethodSchema
);

module.exports = { NotificationMethod };
