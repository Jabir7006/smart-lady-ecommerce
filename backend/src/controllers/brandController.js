const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Brand = require("../models/Brand");

// =============================================================================
// Get all brands
// =============================================================================

exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
  const brands = await Brand.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Brand.countDocuments();
  const pages = Math.ceil(total / limit);
  res.status(200).json({
    brands,
    total,
    page,
    limit,
    pages,
  });
});

// =============================================================================
// Create a new brand
// =============================================================================

exports.createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const brand = await Brand.create({ title });
  res.status(201).json(brand);
});

// =============================================================================
// Update a brand
// =============================================================================

exports.updateBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { title },
    { new: true }
  );
  res.status(200).json(brand);
});

// =============================================================================
// Delete a brand
// =============================================================================

exports.deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  res.status(200).json(brand);
});

// =============================================================================
// Get a single brand
// =============================================================================

exports.getBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw createError(404, "Brand not found");
  res.status(200).json(brand);
});
