const AppError = require("../utils/AppError");

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      // stripUnknown: true,
      allowUnknown: false,
    });

    
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new AppError(message, 400));
    }

    if (property === "query") {
      req.validQuery = value;
    } else {
      req[property] = value;
    }
    
    next();
  };

module.exports = { validate };
