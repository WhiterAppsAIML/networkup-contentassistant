const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { createContentSchema } = require('./content.schema');
const controller = require('./content.controller');
const libraryController = require('../content-library/library.controller');
const { listContentQuerySchema } = require('../content-library/library.schema');
const improveRoutes = require('../content-improve/improve.routes');

const router = express.Router();

// Module 7 — list must come before /:id or "list" would need to be a valid ObjectId
router.get('/', validate(listContentQuerySchema, 'query'), libraryController.listContent);

// Module 1
router.post('/draft', validate(createContentSchema), controller.createDraft);
router.get('/:id', controller.getDraft);

// Module 4
router.post('/:id/generate', controller.generateContent);

// Module 6 — mounted here (not in routes/index.js) so it shares this router's /:id segment
router.use('/:id/improve', improveRoutes);

// Module 7
router.patch('/:id/archive', libraryController.archiveContent);
router.delete('/:id', libraryController.deleteContent);

module.exports = router;
