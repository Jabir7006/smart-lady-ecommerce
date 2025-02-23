const { z } = require("zod");

const createColorSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(2, "Title must be at least 2 characters"),
  }),
});

const updateColorSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid color ID"),
  }),
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").optional(),
  }),
});

const colorIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid color ID"),
  }),
});

module.exports = {
  createColorSchema,
  updateColorSchema,
  colorIdParamSchema,
};
