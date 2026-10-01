const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.isOperational
      ? err.message
      : "Something went wrong. Please try again later.",
  };

  console.log(err)

  if (process.env.NODE_ENV === "development") {
    response.error = err.name;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
