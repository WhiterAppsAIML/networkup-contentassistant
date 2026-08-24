const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { improveContentSchema } = require('./improve.schema');
const controller = require('./improve.controller');

const router = express.Router({ mergeParams: true });

router.post('/', validate(improveContentSchema), controller.improveContent); // POST /content/:id/improve

module.exports = router;
