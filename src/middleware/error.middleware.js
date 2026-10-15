const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError" && err.kind === "ObjectId") {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "Invalid ID format";
  }

  // Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const fields = err.keyValue
      ? Object.keys(err.keyValue).join(", ")
      : "field";
    err.statusCode = 409;
    err.isOperational = true;

    // Custom message for composite key (student + manual)
    if (err.keyValue && err.keyValue.student && err.keyValue.manual) {
      err.message =
        "You already have an active payment submission for this manual.";
    } else {
      err.message = `Duplicate entry for: ${fields}. Submission already exists.`;
    }
  }

  //Fallback
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.isOperational
      ? err.message
      : "Something went wrong. Please try again later.",
  };

  if (process.env.NODE_ENV === "development") {
    response.error = err.name;
    response.stack = err.stack;
  }

  console.log(err.stack);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
