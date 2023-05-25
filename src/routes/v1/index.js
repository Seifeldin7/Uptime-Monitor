const express = require('express');
const userRoute = require('./user.route');
const checkRoute = require('./check.route');
const reportRoute = require('./reports.route');

const router = express.Router();

router.use('/users', userRoute);
router.use('/checks', checkRoute);
router.use('/reports', reportRoute);

module.exports = router;
