const Joi = require('joi');

const selectAngleSchema = Joi.object({
  angleId: Joi.string().hex().length(24).required(),
});

module.exports = { selectAngleSchema };
