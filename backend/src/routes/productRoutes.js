const express = require("express");
const productRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createProductSchema,
  updateProductSchema,
  ratingSchema,
  productIdParamSchema,
  querySchema,
  bulkDeleteSchema,
} = require("../validations/productValidation");
const {
  createProduct,
  findAllProducts,
  findSingleProduct,
  updateProduct,
  deleteProduct,
  rating,
  bulkDeleteProducts,
} = require("../controllers/productController");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

productRouter.use(apiLimiter);

// Public routes
productRouter.get("/", validate(querySchema), findAllProducts);
productRouter.get("/:id", validate(productIdParamSchema), findSingleProduct);

// Protected routes
productRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createProductSchema),
  createProduct
);

productRouter.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(productIdParamSchema),
  validate(updateProductSchema),
  updateProduct
);

productRouter.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(productIdParamSchema),
  deleteProduct
);

productRouter.post("/rating", authMiddleware, validate(ratingSchema), rating);

productRouter.delete(
  "/bulk-delete",
  authMiddleware,
  isAdmin,
  validate(bulkDeleteSchema),
  bulkDeleteProducts
);

module.exports = productRouter;
