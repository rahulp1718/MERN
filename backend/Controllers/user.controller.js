const asyncHandler = require("express-async-handler");
const User = require("../Models/user.model");
const generateToken = require("../config/generateToken");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    return next(new BadRequestError("Please provide all the required fields"));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new BadRequestError("User already exists with this email"));
  }

  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (!user) {
    return next(new BadRequestError("Failed to create user"));
  }

  const { _id, isAdmin } = user;
  const token = generateToken(_id);

  res.status(201).json({
    _id,
    name: user.name,
    email: user.email,
    isAdmin,
    picture: user.picture,
    token,
  });
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return next(new UnauthorizedError("Invalid email or password"));
  }

  const { _id, isAdmin } = user;
  const token = generateToken(_id);

  res.json({
    _id,
    name: user.name,
    email: user.email,
    isAdmin,
    picture: user.picture,
    token,
  });
});

const allUsers = asyncHandler(async (req, res) => {
  const keyWords = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyWords).find({ _id: { $ne: req.user._id } });
  res.json(users);
});

module.exports = { registerUser, authUser, allUsers };
