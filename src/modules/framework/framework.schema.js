const Joi = require('joi');

const createFrameworkSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  structure: Joi.array().items(Joi.string().min(1).max(50)).min(1).required(),
  description: Joi.string().allow('').max(500).default(''),
});

const updateFrameworkSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  structure: Joi.array().items(Joi.string().min(1).max(50)).min(1),
  description: Joi.string().allow('').max(500),
}).min(1);

module.exports = { createFrameworkSchema, updateFrameworkSchema };