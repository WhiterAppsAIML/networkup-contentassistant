class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes "expected" errors from unhandled bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
