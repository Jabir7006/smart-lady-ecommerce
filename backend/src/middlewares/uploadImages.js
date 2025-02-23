/* eslint-disable no-undef */
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Create directories if they don't exist
const createDirectories = () => {
  const publicDir = path.join(__dirname, "../public");
  const imagesDir = path.join(publicDir, "images");
  const productsDir = path.join(imagesDir, "products");
  const categoriesDir = path.join(imagesDir, "categories");

  [publicDir, imagesDir, productsDir, categoriesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create directories when module loads
createDirectories();

// Use memory storage instead of disk storage
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000 },
});

// const resizeImages = async (req, res, next) => {
//   try {
//     if (!req.files) return next();

//     req.files = await Promise.all(
//       req.files.map(async (file) => {
//         const filename = `${file.fieldname}-${Date.now()}-${Math.round(
//           Math.random() * 1e9
//         )}.webp`;

//         // Process image in memory
//         const processedBuffer = await sharp(file.buffer)
//           .resize(300, 300)
//           .toFormat("webp")
//           .webp({ quality: 90 })
//           .toBuffer();

//         // Add processed buffer to file object
//         file.buffer = processedBuffer;
//         file.filename = filename;

//         return file;
//       })
//     );

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

const resizeImages = async (req, res, next) => {
  try {
    if (!req.files) return next();

    req.files = await Promise.all(
      req.files.map(async (file) => {
        const filename = `${file.fieldname}-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.webp`;

        // Process image with better quality settings
        const processedBuffer = await sharp(file.buffer)
          // .resize({ width: 500 }) // Resize only width to maintain aspect ratio
          .toFormat("webp")
          .webp({ quality: 95, effort: 6 }) // Higher quality, optimized compression
          .toBuffer();

        // Add processed buffer to file object
        file.buffer = processedBuffer;
        file.filename = filename;

        return file;
      })
    );

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadPhoto, resizeImages };
