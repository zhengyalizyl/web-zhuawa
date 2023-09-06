'use strict';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.pulses = {};

module.exports.pulses.post = Joi.object().keys({
  content: Joi.string().required(),
  updates: Joi.array(),
});

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
