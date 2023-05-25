const { Check, Report } = require('../models');
const httpStatus = require('http-status');
const { reportService } = require('../services');

async function getReportsByTags(req, res, next) {
  const reports = await reportService.getReportsByTags(
    req.params.tags.split(','),
    req.user
  );
  res.status(httpStatus.OK).json(reports);
}

module.exports = {
  getReportsByTags
};
