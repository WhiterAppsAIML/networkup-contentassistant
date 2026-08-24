const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const service = require('./lead-magnet.service');

const create = asyncHandler(async (req, res) => {
  const lm = await service.createAndGenerate(req.userId, req.body);
  return success(res, lm, 201);
});

const getOne = asyncHandler(async (req, res) => {
  const lm = await service.getOrThrow(req.params.id, req.userId);
  return success(res, lm, 200);
});

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.userId, req.query);
  return success(res, result, 200);
});

module.exports = { create, getOne, list };
