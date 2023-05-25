const { Report } = require('../models');
const checkService = require('./check.service');

const updateReport = async (reportId, checkData) => {
  const report = await Report.findById(reportId);
  const { status } = checkData;
  const timestamp = new Date();
  report.timestamp = timestamp;
  report.status = status;

  if (status === 'up') {
    report.uptime += checkData.interval;
    report.history.push({
      status: 'up',
      timestamp,
      responseTime: checkData.responseTime
    });
    report.responseTime = calculateAverageResponseTime(report.history);
  } else {
    report.outages += 1;
    report.downtime += checkData.interval;
    report.history.push({
      status: 'down',
      timestamp
    });
  }

  report.availability =
    (report.uptime / (report.uptime + report.downtime)) * 100;

  await report.save();
  return report;
};

const getReportsByCheckId = async checkId => {
  const reports = await Report.find({ check: checkId });
  return reports;
};

const getReportsByTags = async (tags, user) => {
  const checks = await checkService.getChecksByTags(tags, user);
  const reports = await Report.find({ check: { $in: checks } });
  return reports;
};

const calculateAverageResponseTime = history => {
  const filteredHistory = history.filter(history => history.status === 'up');
  const totalResponseTime = filteredHistory.reduce(
    (total, check) => total + check.responseTime,
    0
  );
  const averageResponseTime = totalResponseTime / filteredHistory.length;

  return averageResponseTime;
};

module.exports = {
  updateReport,
  getReportsByCheckId,
  getReportsByTags
};
