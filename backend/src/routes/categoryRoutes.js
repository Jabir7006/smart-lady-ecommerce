const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { uploadPhoto, resizeImages } = require("../middlewares/uploadImages");
const {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} = require("../validations/categoryVaidation");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");


router.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createCategorySchema),
  uploadPhoto.single("image"),
  resizeImages,
  createCategory
);
router.get("/", getCategories);

router.get("/:id", validate(categoryIdParamSchema), getCategory);
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(updateCategorySchema),
  updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(categoryIdParamSchema),
  deleteCategory
);


module.exports = router;
