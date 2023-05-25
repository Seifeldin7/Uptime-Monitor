const express = require('express');
const { checkController } = require('../../controllers');
const authMiddleware = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

router
  .route('/')
  .get(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.getChecks)
  )
  .post(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.createCheck)
  );

router
  .route('/:id')
  .get(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.getCheck)
  )
  .put(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.updateCheck)
  )
  .delete(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.deleteCheck)
  );

router
  .route('/tag/:tags')
  .get(
    catchAsync(authMiddleware.authenticate),
    catchAsync(checkController.getChecksByTags)
  );

module.exports = router;
