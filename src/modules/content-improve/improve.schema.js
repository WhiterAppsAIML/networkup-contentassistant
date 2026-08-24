const Joi = require('joi');
const { IMPROVE_ACTIONS } = require('../../ai/prompts/improve.prompt');

const improveContentSchema = Joi.object({
  action: Joi.string()
    .valid(...Object.keys(IMPROVE_ACTIONS))
    .required(),
});

module.exports = { improveContentSchema };
