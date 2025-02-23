const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }).min(2, "Name must be at least 2 characters"),
    color: z.string({
      required_error: "Color is required",
    }).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    color: z.string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  }),
});

const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
};
