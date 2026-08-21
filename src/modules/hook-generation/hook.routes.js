const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { selectHookSchema } = require('./hook.schema');
const controller = require('./hook.controller');

const router = express.Router({ mergeParams: true });

router.post('/', controller.generateHooks); // POST /content/:id/hooks
router.patch('/select', validate(selectHookSchema), controller.selectHook); // PATCH /content/:id/hooks/select

module.exports = router;
