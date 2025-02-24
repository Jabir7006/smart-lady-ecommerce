const express = require("express");
const userRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  updateProfile,
  changePassword,
  // getUser,

  getUserAnalytics,
  getCustomerGrowth,
  getOnlineUsers,
  getSingleUser,

} = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const {
  updateUserSchema,
} = require("../validations/userValidation");

// Protect all routes
userRouter.use(authMiddleware);

// Admin routes
userRouter.get("/", isAdmin, getAllUsers);
userRouter.get("/analytics", isAdmin, getUserAnalytics);
userRouter.get("/growth", isAdmin, getCustomerGrowth);
userRouter.get("/online", isAdmin, getOnlineUsers);

// User routes
userRouter.get("/:id", getSingleUser);
userRouter.put("/:id", updateProfile);

// Profile routes
userRouter.put(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  updateProfile
);
userRouter.put("/me/password", authMiddleware, changePassword);

module.exports = userRouter;
