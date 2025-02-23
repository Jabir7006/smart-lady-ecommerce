const express = require("express");
const authRouter = express.Router();
const validate = require("../middlewares/validateMiddleware");
const {
  registerSchema,
  loginSchema,
  loginAdminSchema,
} = require("../validations/authValidation");
const {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
  checkAuth,
  checkUser,
  handleRefreshToken,
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/admin/login", validate(loginAdminSchema), loginAdmin);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/check", authMiddleware, isAdmin, checkAuth);
authRouter.get("/check-user", authMiddleware, checkUser);
authRouter.get("/refresh", handleRefreshToken);

module.exports = authRouter;
