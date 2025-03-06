const cloudinary = require("../config/cloudinaryConfig");

const imageConfigs = {
  product: {
    folder: "products",

    transformation: [
      { width: 500, crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
  banner: {
    folder: "banners",

    transformation: [
      { width: 1920, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
  banner_mobile: {
    folder: "banners",

    transformation: [
      { width: 768, height: 300, crop: "limit" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
  category: {
    folder: "categories",

    transformation: [
      { width: 300, height: 300, crop: "fill" },
      { quality: "auto", fetch_format: "webp" },
    ],
  },
};

const uploadOnCloudinary = async (buffer, type = "product") => {
  try {
    if (type === "banner") {
      // Upload both desktop and mobile versions for banners
      const [desktopResult, mobileResult] = await Promise.all([
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            imageConfigs.banner,
            (error, result) => {
              if (error) {
                console.error("Cloudinary desktop upload error:", error);
                reject(error);
                return;
              }
              resolve(result);
            }
          );
          const bufferStream = require("stream").Readable.from(buffer);
          bufferStream.pipe(uploadStream);
        }),
        new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            imageConfigs.banner_mobile,
            (error, result) => {
              if (error) {
                console.error("Cloudinary mobile upload error:", error);
                reject(error);
                return;
              }
              resolve(result);
            }
          );
          const bufferStream = require("stream").Readable.from(buffer);
          bufferStream.pipe(uploadStream);
        }),
      ]);

      return {
        public_id: desktopResult.public_id,
        url: desktopResult.secure_url,
        mobile_url: mobileResult.secure_url,
        mobile_public_id: mobileResult.public_id,
      };
    }

    // For other types, proceed with single upload
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
