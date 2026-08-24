const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { createScheduleSchema, listScheduleSchema } = require('./schedule.schema');
const controller = require('./schedule.controller');

const router = express.Router();

router.get('/', validate(listScheduleSchema, 'query'), controller.list);
router.post('/', validate(createScheduleSchema), controller.createSchedule);
router.delete('/:id', controller.cancel);

module.exports = router;
