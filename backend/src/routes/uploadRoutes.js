const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadImages, deleteImages } = require("../controllers/uploadController");
const { uploadPhoto } = require("../middlewares/uploadImages");

const uploadRouter = express.Router();

// Multiple images upload
uploadRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  uploadImages
);

// Single image upload with type
uploadRouter.post(
  "/single/:type(product|banner|category)?",
  authMiddleware,
  isAdmin,
  uploadPhoto.single("image"),
  uploadImages
);

uploadRouter.delete("/delete/:id", authMiddleware, isAdmin, deleteImages);

module.exports = uploadRouter;
