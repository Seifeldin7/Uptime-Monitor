const cron = require('node-cron');
const { checkService } = require('../services');
const { reportService } = require('../services');
const Report = require('../models');

// TODO: replace hardcoded interval
exports.scheduleCheck = check => {
  const task = cron.schedule(`*/${check.interval || 10} * * * *`, async () => {
    console.log(`Check running on ${check.url}...`);

    // Perform the check
    const checkData = await checkService.performCheck(check._id);

    // Update all reports for this check
    const reports = await reportService.getReportsByCheckId(check._id);
    if (!reports) {
      return task;
    }

    reports.forEach(report => {
      reportService.updateReport(report.id, checkData);
    });
  });

  return task;
};
