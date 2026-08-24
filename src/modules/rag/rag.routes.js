const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { addDocumentSchema, addDocumentsBatchSchema, searchSchema, listSchema } = require('./rag.schema');
const controller = require('./rag.controller');

const router = express.Router();

router.get('/', validate(listSchema, 'query'), controller.list);
router.post('/', validate(addDocumentSchema), controller.addDocument);
router.post('/batch', validate(addDocumentsBatchSchema), controller.addDocumentsBatch);
router.get('/search', validate(searchSchema, 'query'), controller.search);
router.delete('/source/:sourceId', controller.removeBySource);
router.delete('/:id', controller.removeById);

module.exports = router;