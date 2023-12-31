const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = [
  // validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Name must be 3 or more characters"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 24 })
    .withMessage("Password must be between 6 and 24 characters"),
  body("email").trim().isEmail().withMessage("Email must be valid"),
  asyncHandler(async (req, res) => {
    // extract the validation errors from a request
    const errors = validationResult(req);
    // there are errors
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    } else {
      // data from form is valid
      // check if user already exists
      const { name, email, password } = req.body;
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error("User already exists with that email");
      } else {
        const user = await User.create({
          name,
          email,
          password,
        });
        // generate token
        const token = generateToken(user._id);
        // send http cookie
        res.cookie("token", token, {
          path: "/",
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: "none",
          secure: true,
        });

        if (user) {
          const { _id, name, email, isMember, isAdmin } = user;
          res.status(201).json({
            _id,
            name,
            email,
            isMember,
            isAdmin,
            token,
          });
        } else {
          res.status(400);
          throw new Error("Invalid user data");
        }
      }
    }
  }),
];

const loginUser = [
  // validate and sanitize fields
  body("email").trim().isEmail().withMessage("Invalid email or password"),
  body("password")
    .trim()
    .isLength({ min: 6, max: 24 })
    .withMessage("Invalid email or password"),

  asyncHandler(async (req, res) => {
    // extract the validation errors from a request
    const errors = validationResult(req);
    // there are errors
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error("Invalid email or password");
    } else {
      // check if user exists
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400);
        throw new Error("User not found, please sign up");
      } else {
        // user exists, compare passwords
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if (passwordIsCorrect) {
          // generate token
          const token = generateToken(user._id);
          // send http cookie
          res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day
            sameSite: "none",
            secure: true,
          });
          const { _id, name, email, isMember, isAdmin } = user;
          res.status(200).json({
            _id,
            name,
            email,
            isMember,
            isAdmin,
            token,
          });
        } else {
          res.status(400);
          throw new Error("Invalid email or password");
        }
      }
    }
  }),
];

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // expire now
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out" });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, isMember, isAdmin } = user;
    res.status(200).json({
      _id,
      name,
      email,
      isMember,
      isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email, isMember, isAdmin } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.isMember = req.body.isMember || isMember;
    user.isAdmin = req.body.isAdmin || isAdmin;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isMember: updatedUser.isMember,
      isAdmin: updatedUser.isAdmin,
    });
  } catch {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
};
