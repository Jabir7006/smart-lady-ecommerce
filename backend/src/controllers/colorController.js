const asyncHandler = require("express-async-handler");
const createError = require("http-errors");
const Color = require("../models/Color");

// =============================================================================
// Get all colors
// ========================================== ===================================

exports.getColors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const colors = await Color.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Color.countDocuments();
  const pages = Math.ceil(total / limit);

  if (!colors) throw createError(404, "Colors not found");
  res.status(200).json({ data: colors, pages, total });
});

// =============================================================================
// Create a new color
// =============================================================================

exports.createColor = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const color = await Color.create({ title });
  res.status(201).json(color);
});

// =============================================================================
// Update a color
// =============================================================================

exports.updateColor = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    { title },
    { new: true }
  );
  res.status(200).json(color);
});

// =============================================================================
// Delete a color
// =============================================================================

exports.deleteColor = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  res.status(200).json(color);
});

// =============================================================================
// Get a single color
// =============================================================================

exports.getColor = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) throw createError(404, "Color not found");
  res.status(200).json(color);
});
