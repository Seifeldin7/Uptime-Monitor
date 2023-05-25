const mongoose = require('mongoose');

// TODO: add unique validation for url
const checkSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    enum: ['http', 'https', 'tcp'],
    required: true
  },
  port: {
    type: Number
  },
  path: {
    type: String
  },
  interval: {
    type: Number
  },
  threshold: {
    type: Number
  },
  authentication: {
    username: String,
    password: String
  },
  httpHeaders: [
    {
      name: String,
      value: String
    }
  ],
  assert: {
    statusCode: Number,
    body: String
  },
  webhook: {
    type: String
  },
  tags: [
    {
      type: String
    }
  ],
  ignoreSSL: {
    type: Boolean
  },
  timeout: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notifications: [
    {
      method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NotificationMethod'
      },
      enabled: { type: Boolean, required: true, default: true }
    }
  ]
});

checkSchema.index({ tags: 1 });

const Check = mongoose.model('Check', checkSchema);

module.exports = { Check, checkSchema };
