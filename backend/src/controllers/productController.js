const asyncHandler = require("express-async-handler");
const productService = require("../services/productService");
const Product = require("../models/Product");
const { deleteImgFromCloudinary } = require("../utils/cloudinary");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      quantity,
      sold,
      category,
      subCategory,
      brand,
      regularPrice,
      discountPrice,
      colors,
      sizes,
      isFeatured,
      images,
      tags,
    } = req.body;

    const data = {
      title,
      description,
      quantity,
      sold,
      category,
      ...(subCategory && subCategory !== "" ? { subCategory } : {}),
      brand,
      regularPrice,
      discountPrice,
      colors,
      sizes,
      isFeatured,
      tags,
      images,
    };

    const product = await productService.createProduct(data);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error in createProduct:", error);
    throw error;
  }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const findAllProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const queryObj = { ...req.query };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "order",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Base query object
    let query = {};

    // Handle search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { "brand.title": { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Handle categories filter
    if (req.query.category) {
      const categoryIds = req.query.category.split(",").filter((id) => id);
      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      }
    }

    // Handle brands filter
    if (req.query.brand) {
      const brandIds = req.query.brand.split(",").filter((id) => id);
      if (brandIds.length > 0) {
        query.brand = { $in: brandIds };
      }
    }

    // Handle price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.regularPrice = {};
      if (req.query.minPrice)
        query.regularPrice.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        query.regularPrice.$lte = Number(req.query.maxPrice);
    }

    // Handle stock status
    if (req.query.inStock === "true" || req.query.outOfStock === "true") {
      const stockConditions = [];
      if (req.query.inStock === "true")
        stockConditions.push({ quantity: { $gt: 0 } });
      if (req.query.outOfStock === "true")
        stockConditions.push({ quantity: 0 });
      if (stockConditions.length > 0) {
        query.$or = stockConditions;
      }
    }

    // Handle featured products
    if (req.query.isFeatured === "true") {
      query.isFeatured = true;
    }

    // Handle rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // Execute count query
    const total = await Product.countDocuments(query);

    // Build the main query
    let productQuery = Product.find(query)
      .populate("category", "name")
      .populate("brand", "title")
      .populate("sizes", "title")
      .populate("colors", "title")
      .skip(skip)
      .limit(limit);
    // Handle sorting
    if (req.query.sort) {
      const sortOrder = req.query.order === "desc" ? -1 : 1;
      const sortField = req.query.sort;

      if (sortField === "price") {
        productQuery = productQuery.sort({
          discountPrice: sortOrder,
          regularPrice: sortOrder,
        });
      } else {
        productQuery = productQuery.sort({ [sortField]: sortOrder });
      }
    } else {
      productQuery = productQuery.sort("-createdAt");
    }

    // Execute query
    const products = await productQuery.lean();

    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      currentPage: page,
      pages,
      limit,
      total,
      hasNextPage,
      hasPrevPage,
      products,
    });
  } catch (error) {
    console.error("Error in findAllProducts:", error);
    throw error;
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const findSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("brand", "title")
    .populate("colors", "title")
    .populate("sizes", "title");

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  try {
    // Clean up the request body
    const updateData = { ...req.body };

    // Handle subCategory specifically
    if (
      updateData.subCategory === "" ||
      updateData.subCategory === null ||
      updateData.subCategory === undefined
    ) {
      updateData.subCategory = null;
    }

    // Ensure color is a string array
    if (updateData.colors) {
      updateData.colors = Array.isArray(updateData.colors)
        ? updateData.colors
        : [String(updateData.colors)];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category brand subCategory");

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    throw error;
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new Error("Product not found");
    }

    // Delete images from Cloudinary first
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((image) =>
        deleteImgFromCloudinary(image.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Then delete the product
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
});

// @desc    Delete multiple products
// @route   DELETE /api/products/bulk-delete
// @access  Private/Admin
const bulkDeleteProducts = asyncHandler(async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new Error("No products selected for deletion");
    }

    // Get all products first to collect their image IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Collect all image public_ids to delete from Cloudinary
    const imagePublicIds = products.reduce((acc, product) => {
      if (product.images && product.images.length > 0) {
        return [...acc, ...product.images.map((img) => img.public_id)];
      }
      return acc;
    }, []);

    // Delete images from Cloudinary
    if (imagePublicIds.length > 0) {
      const deletePromises = imagePublicIds.map((publicId) =>
        deleteImgFromCloudinary(publicId)
      );
      await Promise.all(deletePromises);
    }

    // Delete products from database
    await Product.deleteMany({ _id: { $in: productIds } });

    res.json({
      message: `Successfully deleted ${productIds.length} products`,
      deletedCount: productIds.length,
    });
  } catch (error) {
    console.error("Error in bulk delete products:", error);
    throw error;
  }
});

// @desc    Rating
// @route   POST /api/products/rating
// @access  Private
const rating = asyncHandler(async (req, res) => {
  const { productId, star, comment } = req.body;
  const product = await productService.handleRating(
    req.user._id,
    productId,
    star,
    comment
  );
  res.status(200).json(product);
});

module.exports = {
  createProduct,
  findAllProducts,
  findSingleProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  rating,
};
