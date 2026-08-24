const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const service = require('./rag.service');

const addDocument = asyncHandler(async (req, res) => {
  const docs = await service.addDocument(req.userId, req.body);
  return success(res, docs, 201);
});

const addDocumentsBatch = asyncHandler(async (req, res) => {
  const docs = await service.addDocumentsBatch(req.userId, req.body);
  return success(res, docs, 201);
});

const search = asyncHandler(async (req, res) => {
  const results = await service.search(req.userId, req.query);
  return success(res, results, 200);
});

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.userId, req.query);
  return success(res, result, 200);
});

const removeBySource = asyncHandler(async (req, res) => {
  await service.removeBySource(req.userId, req.params.sourceId);
  return success(res, { message: 'Source documents deleted' }, 200);
});

const removeById = asyncHandler(async (req, res) => {
  await service.removeById(req.userId, req.params.id);
  return success(res, { message: 'Document deleted' }, 200);
});

module.exports = { addDocument, addDocumentsBatch, search, list, removeBySource, removeById };