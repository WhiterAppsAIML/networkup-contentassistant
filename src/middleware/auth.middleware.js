const AppError = require('../utils/AppError');

/**
 * Placeholder auth. There's no login system yet, so this just reads a
 * caller-supplied user id. Every module downstream is already written
 * against `req.userId`, so swapping this for real JWT/session auth later
 * is a one-file change.
 */
module.exports = function attachUser(req, res, next) {
  const userId = req.header('x-user-id');
  if (!userId) {
    return next(new AppError('Missing x-user-id header (auth not implemented yet).', 401));
  }
  req.userId = userId;
  next();
};
