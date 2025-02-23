const express = require("express");
const {
  getHomeBanners,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
} = require("../controllers/homeBannerController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const homeBannerRouter = express.Router();

homeBannerRouter.get("/", getHomeBanners);
homeBannerRouter.post("/", authMiddleware, isAdmin, createHomeBanner);
homeBannerRouter.put("/:id", authMiddleware, isAdmin, updateHomeBanner);
homeBannerRouter.delete("/:id", authMiddleware, isAdmin, deleteHomeBanner);

module.exports = homeBannerRouter;
