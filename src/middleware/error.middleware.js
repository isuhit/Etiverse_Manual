const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError" && err.kind === "ObjectId") {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "Invalid ID format";
  }
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
