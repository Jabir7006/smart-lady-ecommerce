const express = require("express");
const brandRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
} = require("../validations/brandValidation");
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

brandRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createBrandSchema),
  createBrand
);
brandRouter.get("/", getBrands);
brandRouter.get("/:id", validate(brandIdParamSchema), getBrand);
brandRouter.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(updateBrandSchema),
  updateBrand
);
brandRouter.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(brandIdParamSchema),
  deleteBrand
);

module.exports = brandRouter;
