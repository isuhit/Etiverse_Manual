const errorHandler = (err, req, res, next) => {
<<<<<<< HEAD
  
  if(err.name === "CastError" && err.kind === "ObjectId") {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "Invalid ID format";
  }
=======
>>>>>>> f6208a6aa99d9bd6cd53abe313e459bc57dc58fa
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.isOperational
      ? err.message
      : "Something went wrong. Please try again later.",
  };

<<<<<<< HEAD
=======
  console.log(err)
>>>>>>> f6208a6aa99d9bd6cd53abe313e459bc57dc58fa

  if (process.env.NODE_ENV === "development") {
    response.error = err.name;
    response.stack = err.stack;
  }
<<<<<<< HEAD
console.log(err.stack);
=======

>>>>>>> f6208a6aa99d9bd6cd53abe313e459bc57dc58fa
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
