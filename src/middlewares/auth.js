const { promisify } = require('util');
const config = require('config');
const AppError = require('../utils/AppError');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
  // getting token and check if it is there
  let token;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('Please log in.', 401));

  // verification token
  let payload;
  try {
    payload = await promisify(jwt.verify)(token, config.get('JWT_KEY'));
  } catch (er) {
    return next(new AppError('Invalid Token', 400));
  }
  // check if user still exists
  const user = await User.findById(payload.id);
  if (!user)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );

  req.user = user;
  next();
};
