const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  mergeWishlistOnLogin,
} = require("../controllers/wishlistController");

const { authMiddleware } = require("../middlewares/authMiddleware");

const wishlistRouter = express.Router();

wishlistRouter.post("/add", addToWishlist); // Allow guest users
wishlistRouter.delete("/remove/:productId", removeFromWishlist); // Allow guest users
wishlistRouter.get("/", getWishlist); // Allow guest users
wishlistRouter.post("/merge", authMiddleware, mergeWishlistOnLogin); // Merge on login

module.exports = wishlistRouter;
