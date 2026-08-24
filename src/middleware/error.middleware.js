const AppError = require('../utils/AppError');
const { failure } = require('../utils/responseHandler');
const logger = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
module.exports = function errorMiddleware(err, req, res, next) {
  let error = err;

  if (err.name === 'CastError') {
    // e.g. an :id param that isn't a valid Mongo ObjectId
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  } else if (err.name === 'ValidationError' && !err.isOperational) {
    // Mongoose schema validation, as opposed to our own Joi validation (422)
    error = new AppError('Database validation failed.', 400, Object.values(err.errors).map((e) => e.message));
  }

  if (!error.isOperational) {
    logger.error(`${req.method} ${req.originalUrl} —`, err);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong. Please try again.';
  const details = error.isOperational ? error.details : undefined;

  return failure(res, message, statusCode, details);
};
