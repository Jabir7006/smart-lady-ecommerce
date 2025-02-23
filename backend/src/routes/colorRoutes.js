const express = require("express");
const colorRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createColorSchema,
  updateColorSchema,
  colorIdParamSchema,
} = require("../validations/colorValidation");
const {
  createColor,
  getColors,
  getColor,
  updateColor,
  deleteColor,
} = require("../controllers/colorController");

colorRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createColorSchema),
  createColor
);
colorRouter.get("/", getColors);
colorRouter.get("/:id", validate(colorIdParamSchema), getColor);
colorRouter.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(updateColorSchema),
  updateColor
);
colorRouter.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(colorIdParamSchema),
  deleteColor
);

module.exports = colorRouter;
