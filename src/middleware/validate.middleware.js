const AppError = require("../utils/AppError");

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
<<<<<<< HEAD
      // stripUnknown: true,
      allowUnknown: false,
    });

    
=======
      stripUnknown: true,
    });

>>>>>>> f6208a6aa99d9bd6cd53abe313e459bc57dc58fa
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
