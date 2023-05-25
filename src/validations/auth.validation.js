const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');

exports.signup = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8),
  })
};

exports.login = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required()
      .min(8)
  })
};

exports.verify = {
  params: Joi.object().keys({
    token: Joi.string()
      .required()
      .min(8)
  })
};
