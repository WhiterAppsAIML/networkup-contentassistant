/**
 * Every response in this API — success or failure — goes through here so
 * callers (frontend now, anything else later) only ever have to handle one
 * shape:
 *   { success, data, meta: { requestId, timestamp, durationMs }, error }
 *
 * requestId/startTime come from requestContext.middleware, which runs before
 * every route, so controllers never have to pass them in manually.
 */

function buildMeta(req) {
  return {
    requestId: req?.requestId,
    timestamp: new Date().toISOString(),
    durationMs: req?.startTime ? Date.now() - req.startTime : undefined,
  };
}

function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: buildMeta(res.req),
    error: null,
  });
}

function failure(res, message, statusCode = 500, details = null) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    meta: buildMeta(res.req),
    error: { message, details },
  });
}

module.exports = { success, failure };
