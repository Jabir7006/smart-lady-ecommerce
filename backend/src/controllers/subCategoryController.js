const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = new SubCategory({ name, slug: slugify(name), category });
  await subCategory.save();
  res.status(201).json(subCategory);
});

const getSubCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const skip = (page - 1) * limit;
  
  // Create filter object
  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Add search functionality
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  const subCategories = await SubCategory.find(filter)
    .skip(skip)
    .limit(limit)
    .populate("category", "name")
    .sort({ createdAt: -1 });
    
  const total = await SubCategory.countDocuments(filter);
  const pages = Math.ceil(total / limit);
  
  res.status(200).json({
    subCategories,
    total,
    page,
    limit,
    pages,
  });
});

const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate("category");
  if (!subCategory) {
    res.status(404).json({ message: "SubCategory not found" });
  }
  res.status(200).json(subCategory);
});

const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;  
  const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, { name, slug: slugify(name), category }, { new: true });
  res.status(200).json(subCategory);
});

const deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (!subCategory) {
    res.status(404).json({ message: "SubCategory not found" });
  }
  res.status(200).json({ message: "SubCategory deleted successfully" });
});

module.exports = { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory, deleteSubCategory };

