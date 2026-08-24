const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const libraryService = require('./library.service');

const listContent = asyncHandler(async (req, res) => {
  const result = await libraryService.listContent(req.userId, req.query);
  return success(res, result, 200);
});

const archiveContent = asyncHandler(async (req, res) => {
  const content = await libraryService.archiveContent(req.params.id, req.userId);
  return success(res, content, 200);
});

const deleteContent = asyncHandler(async (req, res) => {
  await libraryService.deleteContent(req.params.id, req.userId);
  return success(res, { deleted: true }, 200);
});

const listHooks = asyncHandler(async (req, res) => {
  const result = await libraryService.listHooks(req.userId, req.query);
  return success(res, result, 200);
});

module.exports = { listContent, archiveContent, deleteContent, listHooks };
