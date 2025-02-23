const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, resizeImages } = require("../middlewares/uploadImages");
const {
  uploadImages,
  deleteImages,
} = require("../controllers/uploadController");

const uploadRouter = express.Router();

uploadRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  resizeImages,
  uploadImages
);

uploadRouter.post(
  "/single",
  authMiddleware,
  isAdmin,
  uploadPhoto.single("image"),
  resizeImages,
  uploadImages
);

uploadRouter.delete("/delete/:id", authMiddleware, isAdmin, deleteImages);

module.exports = uploadRouter;
