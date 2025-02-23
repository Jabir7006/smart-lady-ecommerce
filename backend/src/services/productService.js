const slugify = require("slugify");
const createError = require("http-errors");
const Product = require("../models/Product");
const User = require("../models/User");
const { deleteImgFromCloudinary } = require("../utils/cloudinary");

class ProductService {
  async createProduct(productData) {
    try {

      const product = new Product({
        ...productData,
        slug: slugify(productData.title),
      });
      
      const savedProduct = await product.save();

      return savedProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async findAllProducts(queryParams) {
    const { queryObj, page, limit, skip } = this.buildQueryParams(queryParams);

    let query = this.buildQuery(queryObj, queryParams);

    // Count total only when needed
    let totalProducts;
    if (queryParams.page) {
      totalProducts = await Product.countDocuments(JSON.parse(queryObj));
      if (skip >= totalProducts) {
        throw createError(404, "This page does not exist");
      }
    }

    const products = await query.lean().skip(skip).limit(limit);

    return {
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    };
  }

  async findSingleProduct(id) {
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('brand', 'title');
    if (!product) {
      throw createError(404, "Product not found");
    }
    return product;
  }

  async updateProduct(id, updateData) {
    const product = await Product.findById(id);
    if (!product) {
      throw createError(404, "Product not found");
    }

    // If title is updated, update the slug
    if (updateData.title) {
      updateData.slug = slugify(updateData.title);
    }

    // If images are provided and there are existing images, delete them from Cloudinary
    if (updateData.images && product.images && product.images.length > 0) {
      for (const image of product.images) {
        // Check if image is an object with public_id
        if (image.public_id) {
          await deleteImgFromCloudinary(image.public_id);
        }
      }
    }

    // Update the product with new data
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    return await product.save();
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw createError(404, "Product not found");
    }
    await product.deleteOne();
    return true;
  }

  async handleWishlist(userId, productId) {
    const [user, product] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
    ]);

    if (!user) throw createError(404, "User not found");
    if (!product) throw createError(404, "Product not found");

    const isProductInWishlist = user.wishlist.includes(productId);

    if (isProductInWishlist) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    return {
      message: isProductInWishlist
        ? "Product removed from wishlist"
        : "Product added to wishlist",
      wishlist: user.wishlist,
    };
  }

  async handleRating(userId, productId, star, comment) {
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }

    const alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === userId.toString()
    );

    if (alreadyRated) {
      await this.updateExistingRating(productId, userId, star, comment);
    } else {
      await this.addNewRating(productId, userId, star, comment);
    }

    return await this.updateTotalRating(productId);
  }

  buildQueryParams(queryParams) {
    const queryObj = { ...queryParams };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 1;
    const skip = (page - 1) * limit;

    return { queryObj: queryStr, page, limit, skip };
  }

  buildQuery(queryStr, queryParams) {
    let query = Product.find(JSON.parse(queryStr));

    if (queryParams.sort) {
      const sortBy = queryParams.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    if (queryParams.fields) {
      const fields = queryParams.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    return query;
  }

  async updateExistingRating(productId, userId, star, comment) {
    return await Product.updateOne(
      {
        _id: productId,
        "ratings.postedby": userId,
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
        },
      }
    );
  }

  async addNewRating(productId, userId, star, comment) {
    return await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          ratings: {
            star,
            comment,
            postedby: userId,
          },
        },
      },
      { new: true }
    );
  }

  async updateTotalRating(productId) {
    const product = await Product.findById(productId);
    const totalRating = product.ratings.length;
    const ratingSum = product.ratings.reduce(
      (sum, rating) => sum + rating.star,
      0
    );
    product.totalrating = Math.round((ratingSum / totalRating) * 10) / 10;
    return await product.save();
  }

  async deleteProductImage(productId, imageUrl) {
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }

    // Get public ID from image URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete from Cloudinary
    const cloudinaryResult = await deleteImgFromCloudinary(publicId);
    if (cloudinaryResult.result !== "ok") {
      throw createError(400, "Failed to delete image from storage");
    }

    // Remove image from product
    product.images = product.images.filter((img) => img !== imageUrl);
    return await product.save();
  }
}

module.exports = new ProductService();
