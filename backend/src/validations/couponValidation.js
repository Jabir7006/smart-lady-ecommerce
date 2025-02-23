const { z } = require("zod");

const createCouponSchema = z.object({
  name: z.string({ required_error: "Coupon Name Is Required" }),
  expiry: z.date({ required_error: "Coupon Expiry date is required" }),
  discount: z
    .number({ required_error: "Coupon Discount is required" })
    .min(0, "Discount must be at least 0")
    .max(100, "Discount must be at most 100"),
});

module.exports = { createCouponSchema };
