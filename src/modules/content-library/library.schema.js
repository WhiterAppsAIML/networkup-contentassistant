const Joi = require('joi');
const { paginationSchema } = require('../../utils/pagination.schema');
const Content = require('../../models/Content.model');

const listContentQuerySchema = paginationSchema.keys({
  status: Joi.string().valid(...Content.STATUSES),
});

module.exports = { listContentQuerySchema };
