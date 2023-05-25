const { User, userSchema } = require('./user.model');
const { Check, checkSchema } = require('./check.model');
const { Report, reportSchema } = require('./report.model');
const { NotificationMethod } = require('./notification.method.model');
const { EmailNotification } = require('./email.notification.model');

module.exports = {
  User,
  userSchema,
  Check,
  checkSchema,
  Report,
  reportSchema,
  NotificationMethod,
  EmailNotification
};
