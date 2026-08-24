const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const service = require('./framework.service');

const create = asyncHandler(async (req, res) => {
  const framework = await service.create(req.userId, req.body);
  return success(res, framework, 201);
});

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.userId, req.query);
  return success(res, result, 200);
});

const getById = asyncHandler(async (req, res) => {
  const framework = await service.getById(req.params.id, req.userId);
  return success(res, framework, 200);
});

const update = asyncHandler(async (req, res) => {
  const framework = await service.update(req.params.id, req.userId, req.body);
  return success(res, framework, 200);
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.userId);
  return success(res, { message: 'Framework deleted' }, 200);
});

module.exports = { create, list, getById, update, remove };