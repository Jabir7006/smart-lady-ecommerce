const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: "Full name is required",
      })
      .min(3, "Full name must be at least 3 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

const loginAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const createAdminSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: "Full name is required",
      })
      .min(3, "Full name must be at least 3 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  loginAdminSchema,
  createAdminSchema,
};
