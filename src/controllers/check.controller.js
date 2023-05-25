const { checkService } = require('../services');
const httpStatus = require('http-status');
const { scheduleCheck } = require('../jobs/check.cron');
const { Report } = require('../models');

// Create a new check
exports.createCheck = async (req, res, next) => {
  const check = await checkService.createCheck(req.body, req.user);
  const report = new Report({
    check: check._id
  });
  await report.save();

  check.job = scheduleCheck(check);

  res.status(httpStatus.CREATED).json(check);
};

// Update an existing check
exports.updateCheck = async (req, res, next) => {
  const checkId = req.params.id;
  const updatedCheckData = req.body;
  const user = req.user;

  const existingCheck = await checkService.getCheckById(checkId);

  // Stop the existing cron job
  existingCheck.job.stop();

  // Update the check and schedule a new cron job
  const updatedCheck = await checkService.updateCheck(
    checkId,
    updatedCheckData,
    user
  );
  updatedCheck.job = scheduleCheck(updatedCheck);

  res.status(httpStatus.OK).json(updatedCheck);
};

// Delete a check
exports.deleteCheck = async (req, res, next) => {
  const checkId = req.params.id;
  const existingCheck = await checkService.getCheckById(checkId);

  // Stop the existing cron job
  existingCheck.job.stop();

  await checkService.deleteCheck(req.params.id, req.user);
  res.status(httpStatus.OK).end();
};

// Get all checks for a user
exports.getChecks = async (req, res, next) => {
  const checks = await checkService.getChecks(req.user);
  res.status(httpStatus.OK).json(checks);
};

exports.getChecksByTags = async (req, res, next) => {
  const tags = req.params.tags.split(',');
  const checks = await checkService.getChecksByTags(tags, req.user);
  res.status(httpStatus.OK).json(checks);
};

exports.getCheck = async (req, res, next) => {
  const check = await checkService.getCheckById(req.params.id, req.user);
  res.status(httpStatus.OK).json(check);
}
