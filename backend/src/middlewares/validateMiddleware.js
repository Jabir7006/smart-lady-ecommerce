const createError = require("http-errors");

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    // Format Zod validation errors
    if (error.issues) {
      const validationErrors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Handle other types of errors
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = validate;
