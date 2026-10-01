const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/auth.utils");
const AsyncHandler = require("../utils/async-handler");

const protect = AsyncHandler((req, res, next) => {
  let token;
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    throw new AppError("Missing or invalid Token Format", 401);
  }
  const tokenParts = req.headers.authorization.split(" ");
  token = tokenParts[1];

  if (!token || token.trim() === "") {
    throw new AppError("Token missing from Bearer schema.", 401);
  }
  const userPayload = verifyToken(token);
  req.user = {
    id: userPayload.id,
    username: userPayload.username,
    role: userPayload.role,
  };
  next();
});

const restrictTo = (...Roles) => {
  return (req, res, next) => {
    if (!req.user || !Roles.includes(req.user.role)){
      return next(new AppError("You are not authorized to access this route", 403))
    }
    next()
  };
};

module.exports = { protect, restrictTo };
