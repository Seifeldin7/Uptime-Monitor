const axios = require('axios');
const mailer = require('./mailer.service');
const { Check, NotificationMethod } = require('../models');
const AppError = require('../utils/AppError');
const httpStatus = require('http-status');
const { EmailNotification } = require('../models/email.notification.model');

const DEFAULT_TIMEOUT = 10;

const getCheckById = async (id, user) => {
  const check = await Check.findById(id);
  // TODO: Handle errors better and return correct status codes
  checkAuthorization(check, user);

  return check;
};

const createCheck = async (checkData, user) => {
  // Create new email notification
  const emailNotification = new EmailNotification({
    // Set properties of the email notification here
    type: 'EmailNotification'
  });
  await emailNotification.save();

  const check = new Check({
    ...checkData,
    notifications: [
      {
        method: emailNotification._id,
        enabled: true
      }
    ]
  });

  check.user = user;

  return check;
};

const updateCheck = async (id, checkData, user) => {
  // Update an existing check in the database
  const check = await Check.findById(id);
  // TODO: Handle errors better and return correct status codes
  checkAuthorization(check, user);
  const newCheck = await Check.findByIdAndUpdate(id, checkData, {
    new: true
  });
  if (!newCheck) {
    return new AppError('Check not found');
  }
};

const deleteCheck = async (id, user) => {
  // Delete a check from the database
  const check = await Check.findByIdAndDelete(id);
  checkAuthorization(check, user);
  if (!check) {
    throw new Error('Check not found');
  }
};

const getChecksByTags = async (tags, user) => {
  const checks = await Check.find({
    tags: { $in: tags },
    user: user.id
  });
  checks.forEach(check => {
    checkAuthorization(check, user);
  });
  return checks;
};

const performCheck = async checkId => {
  const check = await Check.findById(checkId).populate('notifications.method');

  try {
    // Send request to check URL and calculate response time
    let axiosOptions = generateAxiosOptions(check);

    const startTime = Date.now();
    const response = await axios.get(
      `${check.protocol}://${check.url}`,
      axiosOptions
    );
    const responseTime = Date.now() - startTime;

    return {
      status: response.status === 200 ? 'up' : 'down',
      responseTime: responseTime,
      interval: check.interval || DEFAULT_TIMEOUT
    };
  } catch (error) {
    check.notifications.forEach(notification => {
      notification.notify(check, 'down');
    });
    return {
      status: 'down',
      interval: check.interval || DEFAULT_TIMEOUT
    };
  }
};

const generateAxiosOptions = check => {
  const axiosOptions = {
    timeout: (check.timeout || DEFAULT_TIMEOUT) * 1000
  };

  if (check.assert && check.assert.statusCode) {
    axiosOptions.validateStatus = status => {
      return status === check.assert.statusCode;
    };
  }

  if (check.authentication && check.authentication.username) {
    axiosOptions.auth = {
      username: check.authentication.username,
      password: check.authentication.password
    };
  }

  if (check.httpHeaders && check.httpHeaders.length > 0) {
    check.httpHeaders.forEach(header => {
      axiosOptions.headers[header.name] = header.value;
    });
  }

  if (check.port) {
    axiosOptions.url = `${check.protocol}://${check.url}:${
      check.port
    }${check.path || ''}`;
  } else {
    axiosOptions.url = `${check.protocol}://${check.url}${check.path || ''}`;
  }

  return axiosOptions;
};

const checkAuthorization = (check, user) => {
  if (!check.user.equals(user.id)) {
    throw new AppError(
      'User is not authorized to update this check',
      httpStatus.FORBIDDEN
    );
  }
};

module.exports = {
  performCheck,
  createCheck,
  updateCheck,
  deleteCheck,
  getChecksByTags
};
