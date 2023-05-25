const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.getUser = {
  params: Joi.object().keys({
    userId: Joi.objectId()
  })
};