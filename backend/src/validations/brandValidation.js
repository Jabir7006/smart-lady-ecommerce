const { z } = require("zod");

const createBrandSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(2, "Title must be at least 2 characters"),
  }),
});

const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid brand ID"),
  }),
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").optional(),
  }),
});

const brandIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid brand ID"),
  }),
});

module.exports = {
  createBrandSchema,
  updateBrandSchema,
  brandIdParamSchema,
};
