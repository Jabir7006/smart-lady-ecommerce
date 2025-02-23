const { z } = require("zod");

const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters"),
    color: z.string().optional().default("#ffffff"),
    image: z.any(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  }),
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    color: z.string().optional().default("#ffffff"),
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
