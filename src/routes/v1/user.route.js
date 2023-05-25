const express = require('express');
const { authController } = require('../../controllers');
const validate = require('../../middlewares/validate');
const authMiddleware = require('../../middlewares/auth')
const { authValidation } = require('../../validations');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router
  .route('/signup')
  .post(validate(authValidation.signup), catchAsync(authController.signup));

router
  .route('/login')
  .post(validate(authValidation.login), catchAsync(authController.login));

router
  .route('/verify/:token')
  .patch(validate(authValidation.verify), catchAsync(authController.verify));

module.exports = router;
