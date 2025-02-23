const express = require("express");
const addressRouter = express.Router();

const {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");
const { authMiddleware } = require("../middlewares/authMiddleware");

addressRouter
  .route("/")
  .get(authMiddleware, getUserAddresses)
  .post(authMiddleware, createAddress);
addressRouter
  .route("/:id")
  .get(authMiddleware, getAddressById)
  .put(authMiddleware, updateAddress)
  .delete(authMiddleware, deleteAddress);

module.exports = addressRouter;
