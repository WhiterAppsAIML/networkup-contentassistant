const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const service = require('./schedule.service');

const createSchedule = asyncHandler(async (req, res) => {
  const scheduled = await service.createSchedule(req.userId, req.body);
  return success(res, scheduled, 201);
});

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.userId, req.query);
  return success(res, result, 200);
});

const cancel = asyncHandler(async (req, res) => {
  const scheduled = await service.cancel(req.params.id, req.userId);
  return success(res, scheduled, 200);
});

module.exports = { createSchedule, list, cancel };
