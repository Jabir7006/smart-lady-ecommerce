const express = require("express");
const subCategoryRouter = express.Router();
const { createSubCategory, getSubCategoryById, updateSubCategory, deleteSubCategory, getSubCategories } = require("../controllers/subCategoryController");

subCategoryRouter.post("/", createSubCategory);
subCategoryRouter.get("/", getSubCategories);
subCategoryRouter.get("/:id", getSubCategoryById);
subCategoryRouter.put("/:id", updateSubCategory);
subCategoryRouter.delete("/:id", deleteSubCategory);

module.exports = subCategoryRouter;
