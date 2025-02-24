const express = require("express");
const authRouter = express.Router();
const validate = require("../middlewares/validateMiddleware");
const {
  registerSchema,
  loginSchema,
  loginAdminSchema,
  createAdminSchema,
} = require("../validations/authValidation");
const {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
  checkAuth,
  checkUser,
  handleRefreshToken,
  createAdmin,
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/admin/login", validate(loginAdminSchema), loginAdmin);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/check", authMiddleware, isAdmin, checkAuth);
authRouter.get("/check-user", authMiddleware, checkUser);
authRouter.get("/refresh", handleRefreshToken);

// Create new admin (protected route - only existing admins can create new admins)
authRouter.post(
  "/admin/create",
  authMiddleware,
  isAdmin,
  validate(createAdminSchema),
  createAdmin
);

module.exports = authRouter;
