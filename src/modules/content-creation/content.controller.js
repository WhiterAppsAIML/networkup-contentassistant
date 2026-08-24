const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const contentService = require('./content.service');

const createDraft = asyncHandler(async (req, res) => {
  const content = await contentService.createDraft(req.userId, req.body);
  return success(res, content, 201);
});

const getDraft = asyncHandler(async (req, res) => {
  const content = await contentService.getDraftOrThrow(req.params.id, req.userId);
  return success(res, content, 200);
});

const generateContent = asyncHandler(async (req, res) => {
  const content = await contentService.generateContent(req.params.id, req.userId);
  return success(res, content, 200);
});

module.exports = { createDraft, getDraft, generateContent };
