const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const coupon = new Coupon({ name, expiry, discount });
  const savedCoupon = await coupon.save();
  res.status(201).json(savedCoupon);
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  if (!coupons) {
    return res.status(404).json({ message: "No coupons found" });
  }
  res.status(200).json(coupons);
});

module.exports = { createCoupon, getAllCoupons };
