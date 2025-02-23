const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  mergeCartOnLogin,
  updateCartQuantity,
} = require("../controllers/cartController");

const { authMiddleware } = require("../middlewares/authMiddleware");

const cartRouter = express.Router();

cartRouter.post("/add", addToCart); // Allow guest users
cartRouter.delete("/remove/:productId", removeFromCart); // Allow guest users
cartRouter.get("/", getCart); // Allow guest users
cartRouter.post("/merge", authMiddleware, mergeCartOnLogin); // Merge on login
cartRouter.patch("/update/:productId", updateCartQuantity); // Add this line

module.exports = cartRouter;
