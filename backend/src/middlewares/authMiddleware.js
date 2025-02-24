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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select(
        "-password -refreshToken"
      );

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
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "InvalidToken",
          message: "Invalid token signature",
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
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
