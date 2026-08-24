const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const angleService = require('./angle.service');

const generateAngles = asyncHandler(async (req, res) => {
  const content = await angleService.generateAngles(req.params.id, req.userId);
  return success(res, content, 200);
});

const selectAngle = asyncHandler(async (req, res) => {
  const content = await angleService.selectAngle(req.params.id, req.userId, req.body.angleId);
  return success(res, content, 200);
});

module.exports = { generateAngles, selectAngle };
