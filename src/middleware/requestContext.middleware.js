const { v4: uuidv4 } = require('uuid');

module.exports = function requestContext(req, res, next) {
  req.requestId = uuidv4();
  req.startTime = Date.now();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};
