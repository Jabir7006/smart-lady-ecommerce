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

// TODO: uncomment the following code for production

// const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// const applyMiddleware = (app) => {
//   // Logger should be first to log all requests
//   app.use(morgan("combined")); // Use combined format for more detailed logs in production

//   // Security headers
//   app.use((req, res, next) => {
//     res.setHeader("X-Content-Type-Options", "nosniff");
//     res.setHeader("X-Frame-Options", "DENY");
//     res.setHeader("X-XSS-Protection", "1; mode=block");
//     res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
//     next();
//   });

//   // Parse cookies before CORS to handle credentials
//   app.use(cookieParser());

//   // CORS configuration for production
//   app.use(
//     cors({
//       origin: process.env.ALLOWED_ORIGINS?.split(",") || ["https://yourdomain.com"], // Specify allowed origins
//       credentials: true,
//       methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//       allowedHeaders: [
//         "Content-Type",
//         "Authorization",
//         "X-Requested-With",
//         "Accept",
//         "Origin",
//       ],
//       maxAge: 86400, // Cache preflight requests for 24 hours
//     })
//   );

//   // Enable pre-flight requests
//   app.options("*", cors());

//   // Body parsers after CORS with limits
//   app.use(express.json({ limit: "10mb" }));
//   app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//   // Add request rate limiting
//   const rateLimit = require("express-rate-limit");
//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
//   });
//   app.use(limiter);

//   // Add compression
//   const compression = require("compression");
//   app.use(compression());
// };

// module.exports = applyMiddleware;
