const Joi = require('joi');

const createScheduleSchema = Joi.object({
  contentId: Joi.string().hex().length(24).required(),
  scheduledFor: Joi.date().iso().greater('now').required(),
});

const listScheduleSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
});

module.exports = { createScheduleSchema, listScheduleSchema };
