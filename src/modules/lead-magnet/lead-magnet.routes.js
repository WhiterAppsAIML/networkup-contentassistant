const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { paginationSchema } = require('../../utils/pagination.schema');
const { createLeadMagnetSchema } = require('./lead-magnet.schema');
const controller = require('./lead-magnet.controller');

const router = express.Router();

router.get('/', validate(paginationSchema, 'query'), controller.list);
router.post('/', validate(createLeadMagnetSchema), controller.create);
router.get('/:id', controller.getOne);

module.exports = router;
