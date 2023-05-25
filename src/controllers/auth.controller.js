const { userService, authService, emailService } = require('../services');
const AppError = require('../utils/AppError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const createTokenAndSend = (user, res) => {
  user.password = undefined;
  user.__v = undefined;
  const token = authService.generateAuthToken(user._id);
  res.setHeader('x-auth-token', token);
  return res.status(httpStatus.OK).json({
    token: token,
    user: user
  });
};

exports.verify = async (req, res, next) => {
  const hashedToken = authService.getHashedToken(req.params.token);

  const user = await userService.getUser({
    verifyToken: hashedToken
  });
  if (!user)
    return next(new AppError('Token is invalid', httpStatus.BAD_REQUEST));

  user.verified = true;
  user.verifyToken = undefined;

  await user.save({ validateBeforeSave: false });
  createTokenAndSend(user, res);
};

exports.signup = async (req, res, next) => {
  const newUser = await userService.createUser(req.body);

  // generate verify token
  const verifyToken = authService.createVerifyToken(newUser);

  await newUser.save({
    validateBeforeSave: false
  });

  // use mail to verify user
  const verifyURL = `${req.get('host')}/verify/${verifyToken}`;

  const message = `Hello ${newUser.username}<br>
  CONFIRM ACCOUNT You are almost done<br>Confirm your account below to finish creating your Uptime Monitor account`;

  await emailService.sendMail({
    to: newUser.email,
    subject: 'Verify your Uptime Monitor account',
    text: message,
    html: `verifyURL: <a href="${verifyURL}">${verifyURL}</a>`
  });

  newUser.verifyToken = undefined;
  createTokenAndSend(newUser, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userService.findUserAndCheckPassword(
    { email: email },
    password
  );
  if (!user) {
    return next(
      new AppError('Incorrect email or password!', httpStatus.UNAUTHORIZED)
    );
  }
  user.lastLogin = new Date();

  await user.save();

  createTokenAndSend(user, res);
};
