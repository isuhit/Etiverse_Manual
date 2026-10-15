const User = require("../models/User.model");
const AppError = require("../utils/AppError");

const authenticateUser = async (username, password) => {
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new AppError("Invalid credential, recheck and try again", 401);
  }
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credential, recheck and try again", 401);
  }
  if (!user.isActive) {
    throw new AppError("Account deactivated", 403);
  }

  return user;
};

const getAllUsersService = async () => {
  const users = await User.find()
    .select("-password -__v")
    .sort({ createdAt: -1 });
  return users;
};

module.exports = {
  authenticateUser,
  getAllUsersService,
};
