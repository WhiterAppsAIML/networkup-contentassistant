const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { paginationSchema } = require('../../utils/pagination.schema');
const { createFrameworkSchema, updateFrameworkSchema } = require('./framework.schema');
const controller = require('./framework.controller');

const router = express.Router();

router.get('/', validate(paginationSchema, 'query'), controller.list);
router.post('/', validate(createFrameworkSchema), controller.create);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateFrameworkSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;