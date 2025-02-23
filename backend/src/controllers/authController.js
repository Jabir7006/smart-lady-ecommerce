const createError = require("http-errors");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPasword");
const createUser = require("../services/users");
const createJwt = require("../utils/createJwt");
const setCookie = require("../utils/setCookie");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw createError(403, "Account already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser.createUser({
    fullName,
    email,
    password: hashedPassword,
  });

  const accessToken = createJwt({ userId: user._id }, "15m");
  const refreshToken = createJwt({ userId: user._id }, "7d");

  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in HTTP-only cookie
  setCookie(res, "refreshToken", refreshToken);

  // Remove sensitive data
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(201).json({
    message: "Account Created Successfully",
    user,
    accessToken,
  });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    throw createError(403, "Invalid Credentials");
  }

  const accessToken = createJwt({ userId: user._id }, "15m");
  const refreshToken = createJwt({ userId: user._id }, "7d");

  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in HTTP-only cookie
  setCookie(res, "refreshToken", refreshToken);

  // Remove sensitive data
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(200).json({
    message: "Login Successful",
    user,
    accessToken,
  });
});

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin) {
    throw createError(403, "Invalid Credentials");
  }
  if (admin.role !== "admin") {
    throw createError(403, "Not Authorized");
  }
  if (!admin || !(await comparePassword(password, admin.password))) {
    throw createError(403, "Invalid Credentials");
  }
  const accessToken = createJwt({ userId: admin._id }, "15m");
  const refreshToken = createJwt({ userId: admin._id }, "7d");

  admin.refreshToken = refreshToken;
  await admin.save();

  setCookie(res, "refreshToken", refreshToken);

  admin.password = undefined;

  res.status(200).json({
    message: "Login Successful",
    user: admin,
    token: accessToken,
  });
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw createError(401, "No refresh token in cookies");
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw createError(401, "Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (user._id.toString() !== decoded.userId) {
      throw createError(401, "Token mismatch");
    }

    // Generate new tokens
    const accessToken = createJwt({ userId: user._id }, "15m");
    const newRefreshToken = createJwt({ userId: user._id }, "7d");

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new refresh token in cookie
    setCookie(res, "refreshToken", newRefreshToken);

    // Return new access token
    res.json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        // Add other non-sensitive user fields you need
      },
    });
  } catch (err) {
    // If token is expired or invalid, clear tokens
    user.refreshToken = "";
    await user.save();
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    throw createError(401, "Invalid refresh token");
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  try {
    // Get the user from middleware
    const user = req.user;

    if (!user) {
      throw createError(401, "Not authenticated");
    }

    // Clear refresh token in database
    await User.findByIdAndUpdate(user._id, {
      refreshToken: "",
    });

    // Clear cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    throw createError(500, error.message || "Error during logout");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  // The authMiddleware will already verify the token and set req.user
  // We just need to check if the user exists and is an admin
  const user = req.user;

  if (!user) {
    throw createError(401, "Not authenticated");
  }

  if (user.role !== "admin") {
    throw createError(403, "Not authorized");
  }

  // Return user info without sensitive data
  user.password = undefined;
  res.json({ user });
});

const checkUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw createError(401, "Not authenticated");
  }

  // Return user info without sensitive data
  user.password = undefined;
  res.json({ user });
});
module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  handleRefreshToken,
  logout,
  checkAuth,
  checkUser,
};
