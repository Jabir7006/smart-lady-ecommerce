const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Size = require("../models/Size");

// =============================================================================
// Get all sizes
// ========================================== ===================================

exports.getSizes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const sizes = await Size.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Size.countDocuments();
  const pages = Math.ceil(total / limit);

  if (!sizes) throw createError(404, "sizes not found");
  res.status(200).json({ data: sizes, pages, total });
});

// =============================================================================
// Create a new size
// =============================================================================

exports.createSize = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const size = await Size.create({ title });
  res.status(201).json(size);
});

// =============================================================================
// Update a size
// =============================================================================

exports.updateSize = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const size = await Size.findByIdAndUpdate(
    req.params.id,
    { title },
    { new: true }
  );
  res.status(200).json(size);
});

// =============================================================================
// Delete a size
// =============================================================================

exports.deleteSize = asyncHandler(async (req, res) => {
  const size = await Size.findByIdAndDelete(req.params.id);
  res.status(200).json(size);
});

// =============================================================================
// Get a single size
// =============================================================================

exports.getSize = asyncHandler(async (req, res) => {
  const size = await Size.findById(req.params.id);
  if (!size) throw createError(404, "size not found");
  res.status(200).json(size);
});
