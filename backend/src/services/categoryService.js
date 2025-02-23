const createError = require("http-errors");
const Category = require("../models/Category");
const slugify = require("slugify");

class CategoryService {
  async createCategory(categoryData) {
    const { name } = categoryData;

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw createError(409, "Category with this name already exists");
    }

    // Create slug from name
    categoryData.slug = slugify(name);

    const category = await Category.create(categoryData);
    return category;
  }

  async getAllCategories() {
    const categories = await Category.find().sort({ createdAt: -1 });
    return categories;
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError(404, "Category not found");
    }
    return category;
  }

  async updateCategory(id, updateData) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError(404, "Category not found");
    }

    // If name is updated, update the slug
    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    // Update the category
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        category[key] = updateData[key];
      }
    });

    return await category.save();
  }

  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw createError(404, "Category not found");
    }

    await category.deleteOne();
    return { message: "Category deleted successfully" };
  }
}

module.exports = new CategoryService();
