const cloudinary = require("../config/cloudinaryConfig");

const imageConfigs = {
  product: {
    folder: "products",
    format: "webp",
    quality: "auto",
    transformation: [
      { width: 800, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
  banner: {
    folder: "banners",
    format: "webp",
    quality: "auto",
    transformation: [
      { width: 1920, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
  category: {
    folder: "categories",
    format: "webp",
    quality: "auto",
    transformation: [
      { width: 400, height: 400, crop: "fill" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
};

const uploadOnCloudinary = async (buffer, type = "product") => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        imageConfigs[type],
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
            return;
          }

          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );

      const bufferStream = require("stream").Readable.from(buffer);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error in uploadOnCloudinary:", error);
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);
  }
};

const deleteImgFromCloudinary = async (fileToDelete) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        fileToDelete,
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Error deleting image from Cloudinary:", error);
            reject(error);
            return;
          }

          console.log("Deleted image from Cloudinary:", result);
          resolve(result);
        }
      );
    });
  } catch (error) {
    throw new Error(`Error deleting from Cloudinary: ${error.message}`);
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteImgFromCloudinary,
};
