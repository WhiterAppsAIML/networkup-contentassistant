const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { paginationSchema } = require('../../utils/pagination.schema');
const controller = require('./library.controller');

const router = express.Router();

router.get('/', validate(paginationSchema, 'query'), controller.listHooks); // GET /hooks

module.exports = router;
