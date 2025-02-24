const createError = require("http-errors");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPasword");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.json({ users });
});

// Get single user
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = id === "me" ? req.user._id : id;

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw createError(404, "User not found");
  }
  res.json({ user });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updateData = req.body;

  // Remove sensitive fields if present
  delete updateData.password;
  delete updateData.refreshToken;
  delete updateData.role;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw createError(404, "User not found");
  }

  res.json({ user });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw createError(404, "User not found");
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw createError(401, "Current password is incorrect");
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  updateProfile,
  changePassword,
};
