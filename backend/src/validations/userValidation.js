const { z } = require("zod");

const updateUserSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    address: z
      .object({
        street: z.string().min(5, "Street must be at least 5 characters"),
        city: z.string().min(2, "City must be at least 2 characters"),
        state: z.string().min(2, "State must be at least 2 characters"),
        zipCode: z
          .string()
          .regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
      })
      .optional(),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
  }),
});

const querySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sort: z.string().optional(),
    fields: z.string().optional(),
  }),
});

module.exports = {
  updateUserSchema,
  userIdParamSchema,
  querySchema,
};
