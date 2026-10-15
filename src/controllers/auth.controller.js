const { generateToken } = require("../utils/auth.utils");
const AsyncHandler = require("../utils/async-handler");
const {
  authenticateUser,
  getAllUsersService,
} = require("../services/auth.service");
const User = require("../models/User.model");
const AppError = require("../utils/AppError");

const login = AsyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  //Check for valid credentials
  const user = await authenticateUser(username, password);

  //Generate Token
  const token = generateToken(username, user._id, user.role);
  const userDetails = {
    name: user.name,
    username: user.username,
    role: user.role,
  };
  res.status(200).json({
    success: true,
    data: {
      userDetails,
      token,
    },
  });
});

const me = AsyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError("User details not found", 404);
  }
  const userDetails = {
    name: user.name,
    username: user.username,
    role: user.role,
  };
  res.status(200).json({
    success: true,
    data: userDetails,
  });
});

const createUser = AsyncHandler(async (req, res, next) => {
  const { name, username, password, role, isActive } = req.body;
  const user = await User.create({
    name,
    username,
    password,
    role,
    isActive,
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

const getAllUsersController = AsyncHandler(async (req, res) => {
  const users = await getAllUsersService();

  res.status(200).json({
    status: "success",
    results: users.length,
    data:  users ,
  });
});

module.exports = { login, me, createUser, getAllUsersController };
