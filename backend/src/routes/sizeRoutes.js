const express = require("express");
const sizeRouter = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createColorSchema,
  updateColorSchema,
  colorIdParamSchema,
} = require("../validations/colorValidation");
const {
  createSize,
  getSizes,
  getSize,
  updateSize,
  deleteSize,
} = require("../controllers/sizeController");

sizeRouter.post(
  "/",
  authMiddleware,
  isAdmin,
  validate(createColorSchema),
  createSize
);
sizeRouter.get("/", getSizes);
sizeRouter.get("/:id", validate(colorIdParamSchema), getSize);
sizeRouter.patch(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(updateColorSchema),
  updateSize
);
sizeRouter.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  validate(colorIdParamSchema),
  deleteSize
);

module.exports = sizeRouter;
