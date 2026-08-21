const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const hookService = require('./hook.service');

const generateHooks = asyncHandler(async (req, res) => {
  const hooks = await hookService.generateHooks(req.params.id, req.userId);
  return success(res, hooks, 200);
});

const selectHook = asyncHandler(async (req, res) => {
  const content = await hookService.selectHook(req.params.id, req.userId, req.body.hookId);
  return success(res, content, 200);
});

module.exports = { generateHooks, selectHook };
