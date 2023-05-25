const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now()
  },
  status: {
    type: String,
    enum: ['up', 'down'],
    required: true,
    default: 'up'
  },
  availability: {
    type: Number,
    required: true,
    default: 100
  },
  downtime: {
    type: Number,
    required: true,
    default: 0
  },
  uptime: {
    type: Number,
    required: true,
    default: 0
  },
  responseTime: {
    type: Number,
    required: true,
    default: 0
  },
  outages: {
    type: Number,
    required: true,
    default: 0
  },
  history: [
    {
      status: {
        type: String,
        enum: ['up', 'down'],
        required: true,
        default: 'up'
      },
      timestamp: {
        type: Date,
        required: true,
        default: Date.now()
      },
      responseTime: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ],
  check: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Check',
    required: true
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = { Report, reportSchema };
