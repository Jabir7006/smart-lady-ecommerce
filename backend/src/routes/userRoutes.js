const express = require("express");
const userRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getSingleUser,
  updateProfile,
  changePassword,
} = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const {
  userIdParamSchema,
  updateUserSchema,
} = require("../validations/userValidation");

userRouter.get("/", authMiddleware, isAdmin, getAllUsers);
userRouter.get(
  "/:id",
  validate(userIdParamSchema),
  authMiddleware,
  getSingleUser
);

// Profile routes
userRouter.put(
  "/me",
  authMiddleware,
  validate(updateUserSchema),
  updateProfile
);
userRouter.put("/me/password", authMiddleware, changePassword);

module.exports = userRouter;
