const express = require('express');
const { reportController } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router
  .route('/tag/:tags')
  .get(
    catchAsync(authMiddleware.authenticate),
    catchAsync(reportController.getReportsByTags)
  );

module.exports = router;
