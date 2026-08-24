const Joi = require('joi');

// Shared by every list endpoint (content library, hooks library, lead
// magnets, schedule) so pagination behaves identically everywhere.
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

module.exports = { paginationSchema };
