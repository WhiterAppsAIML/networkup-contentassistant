const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { createContentSchema } = require('./content.schema');
const controller = require('./content.controller');

const router = express.Router();

router.post('/draft', validate(createContentSchema), controller.createDraft);
router.get('/:id', controller.getDraft);
router.post('/:id/generate', controller.generateContent);

module.exports = router;
