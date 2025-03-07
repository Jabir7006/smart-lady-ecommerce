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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    // Handle search - search in title, description, and brand title
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { "brand.title": searchRegex },
      ];
    }

    // Handle categories filter - support multiple categories
    if (req.query.category) {
      const categories = req.query.category.split(",").filter(Boolean);
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Handle brands filter - support multiple brands
    if (req.query.brand) {
      const brands = req.query.brand.split(",").filter(Boolean);
      if (brands.length > 0) {
        query.brand = { $in: brands };
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
      if (req.query.inStock === "true" && req.query.outOfStock === "true") {
        // Both selected, no need for filter
      } else if (req.query.inStock === "true") {
        query.quantity = { $gt: 0 };
      } else if (req.query.outOfStock === "true") {
        query.quantity = 0;
      }
    }

    // Execute count query
    const total = await Product.countDocuments(query);

    // Build main query with population
    const productQuery = Product.find(query)
      .populate("category", "name")
      .populate("brand", "title")
      .populate("colors", "title")
      .populate("sizes", "title")
      .skip(skip)
      .limit(limit)
      .lean();

    // Handle sorting
    if (req.query.sort) {
      const sortOrder = req.query.order === "desc" ? -1 : 1;
      const sortField = {};
      if (req.query.sort === "price") {
        sortField.regularPrice = sortOrder;
        sortField.discountPrice = sortOrder;
      } else {
        sortField[req.query.sort] = sortOrder;
      }
      productQuery.sort(sortField);
    } else {
      productQuery.sort("-createdAt");
    }

    // Execute query
    const products = await productQuery;

    // Transform products for response
    const transformedProducts = products.map((product) => ({
      _id: product._id,
      title: product.title,
      description: product.description,
      thumbnail: product.images[0]?.url,
      secondaryImage: product.images[1]?.url || null,
      colors: product.colors?.map((color) => color.title) || [],
      sizes: product.sizes?.map((size) => size.title) || [],
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      quantity: product.quantity,
      category: product.category?.name,
      brand: product.brand?.title,
      totalRating: product.totalRating,
      isFeatured: product.isFeatured,
    }));

    // Send response
    res.status(200).json({
      success: true,
      currentPage: page,
      pages: Math.ceil(total / limit),
      limit,
      total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
      products: transformedProducts,
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
