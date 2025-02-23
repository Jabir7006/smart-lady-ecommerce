const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Category = require("../models/Category");
const { deleteImgFromCloudinary } = require("../utils/cloudinary");
const { default: slugify } = require("slugify");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

// =============================================================================
// Get all categories
// =============================================================================

exports.getCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const skip = (page - 1) * limit;

  const sortOptions = {};
  if (sort && sort !== "") {
    sortOptions[sort] = order === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const categories = await Category.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOptions);

  const total = await Category.countDocuments(query);
  const pages = Math.ceil(total / limit);

  res.status(200).json({
    categories,
    total,
    page: Number(page),
    limit: Number(limit),
    pages,
  });
});

// =============================================================================
// Create a new category
// =============================================================================

exports.createCategory = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);

  const { name, color, image, imageId } = req.body;

  if (!name) {
    throw createError(400, "Name is required");
  }

  // Check for existing category
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw createError(400, "Category already exists");
  }

  // Create category with validated data
  const categoryData = {
    name,
    color: color || "#FEEFEA",
    image: image || "",
    imageId: imageId || "",
  };

  const category = new Category({
    name,
    slug: slugify(name),
    color,
    image,
    imageId,
  });
  const savedCategory = await category.save();
  res.status(201).json(savedCategory);
});

// =============================================================================
// Update a category
// =============================================================================

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, color, imageId, image } = req.body;
  const categoryId = req.params.id;

  // Find the category
  const category = await Category.findById(categoryId);
  if (!category) {
    throw createError(404, "Category not found");
  }

  // If there's a new image and an old image exists, delete the old one
  if (imageId && category.imageId && imageId !== category.imageId) {
    try {
      await deleteImgFromCloudinary(category.imageId);
    } catch (error) {
      console.error("Error deleting old image:", error);
      // Continue with update even if image deletion fails
    }
  }

  // Update category
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name || category.name,
      slug: name ? slugify(name) : category.slug,
      color: color || category.color,
      image: image || category.image,
      imageId: imageId || category.imageId,
    },
    { new: true }
  );

  res.status(200).json(updatedCategory);
});

// =============================================================================
// Delete a category
// =============================================================================

exports.deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;

  // Find the category first to get the image ID
  const category = await Category.findById(categoryId);

  const subCategories = await SubCategory.find({ category: categoryId });
  if (subCategories.length > 0) {
    throw createError(
      400,
      "Category has sub categories, delete sub categories first"
    );
  }

  const products = await Product.find({ category: categoryId });
  if (products.length > 0) {
    throw createError(400, "Category has products, delete products first");
  }

  if (!category) {
    throw createError(404, "Category not found");
  }

  // Delete image from Cloudinary if it exists
  if (category.imageId) {
    try {
      await deleteImgFromCloudinary(category.imageId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      // Continue with category deletion even if image deletion fails
    }
  }

  // Delete the category
  await Category.findByIdAndDelete(categoryId);
  res.sendStatus(204);
});

// =============================================================================
// Get a single category
// =============================================================================

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw createError(404, "Category not found");
  }

  res.status(200).json(category);
});
