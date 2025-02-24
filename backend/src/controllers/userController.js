const createError = require("http-errors");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hashPasword");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  // Build query
  const query = {};
  if (role) {
    query.role = role;
  }

  // Get users with filtered fields
  const users = await User.find(query)
    .select("fullName email isActive createdAt role")
    .sort("-createdAt");

  console.log(`Found ${users.length} users with role: ${role || "all"}`); // Debug log

  res.json({
    success: true,
    users,
    count: users.length,
  });
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

// Get user analytics
const getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const activeUsers = await User.countDocuments({
    role: "user",
    isActive: true,
  });
  const newUsersThisMonth = await User.countDocuments({
    role: "user",
    createdAt: { $gte: new Date(new Date().setDate(1)) },
  });

  res.json({
    totalUsers,
    activeUsers,
    newUsersThisMonth,
  });
});

// Get customer growth data
const getCustomerGrowth = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const growthData = await User.aggregate([
    {
      $match: {
        role: "user",
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: "$_id.year" },
            "-",
            {
              $cond: {
                if: { $lt: ["$_id.month", 10] },
                then: { $concat: ["0", { $toString: "$_id.month" }] },
                else: { $toString: "$_id.month" },
              },
            },
          ],
        },
        count: 1,
      },
    },
  ]);

  res.json(growthData);
});

// Get online users data
const getOnlineUsers = asyncHandler(async (req, res) => {
  // For demo purposes, generate sample data
  const currentHour = new Date().getHours();
  const data = [];

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - i + 24) % 24;
    data.push({
      time: `${hour}:00`,
      count: Math.floor(Math.random() * 50) + 10, // Random number between 10-60
    });
  }

  res.json(data.reverse());
});

module.exports = {
  getAllUsers,
  getSingleUser,
  updateProfile,
  changePassword,
  getUserAnalytics,
  getCustomerGrowth,
  getOnlineUsers,
};
