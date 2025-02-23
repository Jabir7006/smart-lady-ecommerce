const cloudinary = require("../config/cloudinaryConfig");

const uploadOnCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "products"
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
            return;
          }
          console.log("Cloudinary upload result:", result);
          
          // Ensure we're returning the exact structure needed by the Product model
          resolve({
            public_id: result.public_id,
            url: result.secure_url
          });
        }
      );

      // Convert buffer to stream and pipe to uploadStream
      const bufferStream = require('stream').Readable.from(buffer);
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
        {
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            result: result,
          });
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
