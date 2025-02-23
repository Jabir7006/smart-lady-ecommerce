const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const applyMiddleware = (app) => {
  // Logger should be first to log all requests
  app.use(morgan("dev"));

  // Parse cookies before CORS to handle credentials
  app.use(cookieParser());

  // TODO: CORS configuration
  app.use(
    cors({
      origin: true, // Allow all origins in development
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
    })
  );

  // Enable pre-flight requests
  app.options("*", cors());

  // Body parsers after CORS
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = applyMiddleware;
