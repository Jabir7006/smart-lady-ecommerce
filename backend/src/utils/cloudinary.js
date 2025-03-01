const cloudinary = require("../config/cloudinaryConfig");

const uploadOnCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "products",
          format: "webp",  
          quality: "auto", 
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
            return;
          }

          resolve({
            public_id: result.public_id,
            url: result.secure_url, // Use secure CDN URL
          });
        }
      );

      // Pipe buffer to Cloudinary upload stream
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
