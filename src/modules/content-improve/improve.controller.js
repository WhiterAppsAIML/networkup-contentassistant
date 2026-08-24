const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/responseHandler');
const improveService = require('./improve.service');

const improveContent = asyncHandler(async (req, res) => {
  const content = await improveService.improveContent(req.params.id, req.userId, req.body.action);
  return success(res, content, 200);
});

module.exports = { improveContent };
