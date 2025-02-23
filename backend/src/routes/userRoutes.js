const express = require("express");
const userRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { getAllUsers, getSingleUser } = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const { userIdParamSchema } = require("../validations/userValidation");

userRouter.get("/", authMiddleware, isAdmin, getAllUsers);
userRouter.get(
  "/:id",
  validate(userIdParamSchema),
  authMiddleware,
  getSingleUser
);

module.exports = userRouter;
