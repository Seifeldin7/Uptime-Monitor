const { User } = require('../models');
const authService = require('./auth.service');
const fs = require('fs').promises;
const logger = require('../config/logger');

const findUserAndCheckPassword = async (userData, password) => {
  const user = await User.findOne(userData).select('+password');

  if (!user || !(await authService.checkPassword(password, user.password))) {
    return null;
  }
  return user;
};

const findUserByIdAndCheckPassword = async (userId, password) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !(await authService.checkPassword(password, user.password))) {
    return null;
  }
  return user;
};

const getUserById = async userId => {
  const user = await User.findById(userId);
  return user;
};

const getUser = async userData => {
  const user = await User.findOne(userData);
  return user;
};

const createUser = async userData => {
  const user = await User.create(userData);
  return user;
};

module.exports = {
  findUserAndCheckPassword,
  findUserByIdAndCheckPassword,
  createUser,
  getUserById,
  getUser
};
