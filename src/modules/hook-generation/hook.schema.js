const Joi = require('joi');

const selectHookSchema = Joi.object({
  hookId: Joi.string().hex().length(24).required(),
});

module.exports = { selectHookSchema };
