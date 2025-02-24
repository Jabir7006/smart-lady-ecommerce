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
        fullName: z.string().min(3, "Full name must be at least 3 characters"),
        phone: z
          .string()
          .regex(
            /^(?:\+88|88)?(01[3-9]\d{8})$/,
            "Please enter a valid Bangladeshi phone number"
          ),
        street: z.string().min(5, "Street must be at least 5 characters"),
        area: z.string().min(2, "Area must be at least 2 characters"),
        city: z.string().min(2, "City must be at least 2 characters"),
        division: z.enum(
          [
            "Dhaka",
            "Chittagong",
            "Rajshahi",
            "Khulna",
            "Barisal",
            "Sylhet",
            "Rangpur",
            "Mymensingh",
          ],
          "Please select a valid division"
        ),
        postCode: z.string().regex(/^\d{4}$/, "Post code must be 4 digits"),
        addressType: z.enum(
          ["Home", "Office"],
          "Please select a valid address type"
        ),
        isDefault: z.boolean().default(false),
      })
      .optional(),
  }),
});

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().refine(
      (val) => {
        // Check if it's a valid MongoDB ObjectId (24 chars hex)
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        // Check if it's a special value like 'me'
        const specialValues = ["me"];

        return objectIdPattern.test(val) || specialValues.includes(val);
      },
      {
        message: "Invalid user ID format",
      }
    ),
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
