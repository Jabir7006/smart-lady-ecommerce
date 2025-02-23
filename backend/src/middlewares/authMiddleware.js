require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw createError(401, "No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw createError(401, "User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "TokenExpired",
          message: "Access token has expired",
        });
      }
      throw error;
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(createError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    next(createError(403, "Access denied. Admin only."));
  } else {
    next();
  }
};

const isUser = (req, res, next) => {
  if (!req.user) {
    next(createError(403, "Access denied. Authentication required."));
  } else {
    next();
  }
};

module.exports = {
  authMiddleware,
  isAdmin,
  isUser,
};
