const express = require("express");
const couponRouter = express.Router();
const {
  createCoupon,
  getAllCoupons,
} = require("../controllers/couponController");

const validate = require("../middlewares/validateMiddleware");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createCouponSchema } = require("../validations/couponValidation");

couponRouter.get("/", getAllCoupons);
couponRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createCouponSchema),
  createCoupon
);

module.exports = couponRouter;
