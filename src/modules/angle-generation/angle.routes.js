const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { selectAngleSchema } = require('./angle.schema');
const controller = require('./angle.controller');

const router = express.Router({ mergeParams: true });

router.post('/', controller.generateAngles); // POST /content/:id/angles
router.patch('/select', validate(selectAngleSchema), controller.selectAngle); // PATCH /content/:id/angles/select

module.exports = router;
