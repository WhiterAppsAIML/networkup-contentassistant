const AppError = require('../utils/AppError');

module.exports = function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(new AppError('Validation failed', 422, details));
    }

    req[source] = value;
    next();
  };
};
