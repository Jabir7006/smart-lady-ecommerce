const { z } = require("zod");

const createProductSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(3, "Title must be at least 3 characters"),
    description: z
      .string({
        required_error: "Description is required",
      })
      .min(10, "Description must be at least 10 characters"),
    quantity: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string") {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) {
            throw new Error("Quantity must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .refine((val) => val >= 0, {
        message: "Quantity cannot be negative",
      }),
    sold: z.number().default(0).optional(),
    category: z
      .string({
        required_error: "Category is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
    subCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid subcategory ID")
      .nullable()
      .optional()
      .or(z.literal("")),
    brand: z
      .string({
        required_error: "Brand is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid brand ID"),
    regularPrice: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error("Regular price must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .refine((val) => val > 0, {
        message: "Regular price must be positive",
      }),
    discountPrice: z
      .union([z.string(), z.number(), z.literal("")])
      .transform((val) => {
        if (val === "") return null;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error("Discount price must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .nullable()
      .refine((val) => val === null || val >= 0, {
        message: "Discount price cannot be negative",
      })
      .optional(),
    color: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false).optional(),
    images: z
      .array(
        z.object({
          public_id: z.string(),
          url: z.string(),
        })
      )
      .min(1, "At least one image is required"),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    quantity: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string") {
          const parsed = parseInt(val, 10);
          if (isNaN(parsed)) {
            throw new Error("Quantity must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .refine((val) => val >= 0, {
        message: "Quantity cannot be negative",
      })
      .optional(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
      .optional(),
    subCategory: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid subcategory ID")
      .nullable()
      .optional(),
    brand: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid brand ID")
      .optional(),
    regularPrice: z
      .union([z.string(), z.number()])
      .transform((val) => {
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error("Regular price must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .refine((val) => val > 0, {
        message: "Regular price must be positive",
      })
      .optional(),
    discountPrice: z
      .union([z.string(), z.number(), z.literal("")])
      .transform((val) => {
        if (val === "") return null;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (isNaN(parsed)) {
            throw new Error("Discount price must be a valid number");
          }
          return parsed;
        }
        return val;
      })
      .nullable()
      .refine((val) => val === null || val >= 0, {
        message: "Discount price cannot be negative",
      })
      .optional(),
    color: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    images: z
      .array(
        z.object({
          public_id: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  }),
});

const ratingSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
    star: z.number().min(1).max(5),
    comment: z.string().min(4).optional(),
  }),
});

const wishlistSchema = z.object({
  body: z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
  }),
});

const productIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Product ID is required",
      })
      .min(1, "Product ID cannot be empty"),
  }),
});

const querySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
    sort: z.string().optional(),
    fields: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    regularPrice: z.string().optional(),
    discountPrice: z.string().optional(),
    // Add other query parameters as needed
  }),
});

const bulkDeleteSchema = z.object({
  body: z.object({
    productIds: z
      .array(
        z.string({
          required_error: "Product IDs are required",
        })
      )
      .min(1, "At least one product ID is required"),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  ratingSchema,
  wishlistSchema,
  productIdParamSchema,
  querySchema,
  bulkDeleteSchema,
};
