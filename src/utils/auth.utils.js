const jwt = require("jsonwebtoken");
const config = require("../config/env");
const AppError = require("../utils/AppError");

const generateToken = (username, id, role) => {
  const secret = config.jwtSecret;

  if (!secret) {
    throw new AppError("JWT secret not configured", 500);
  }
  const expirationTime = config.jwtExpiresIn;
  const payload = { username, id, role };

  const token = jwt.sign(payload, secret, { expiresIn: expirationTime });

  return token;
};

const verifyToken = (token) => {
  const secret = config.jwtSecret;
  if (!secret) {
    throw new AppError("JWT secret not configured", 500);
  }
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new AppError("Invalid or Expired Token", 401);
  }
};

module.exports = { generateToken, verifyToken };
