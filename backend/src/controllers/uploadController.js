const fs = require("fs");
const asyncHandler = require("express-async-handler");
const {
  uploadOnCloudinary,
  deleteImgFromCloudinary,
} = require("../utils/cloudinary");
const createError = require("http-errors");

const uploadImages = asyncHandler(async (req, res) => {
  try {


    // Handle single file upload with field name 'image'
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer);
      console.log('Upload result:', result);
      return res.json({
        success: true,
        data: {
          url: result.url,
          public_id: result.public_id
        }
      });
    }

    // Handle multiple files upload with field name 'images'
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadOnCloudinary(file.buffer));
      const results = await Promise.all(uploadPromises);
      return res.json({
        success: true,
        data: results.map(result => ({
          url: result.url,
          public_id: result.public_id
        }))
      });
    }

    throw createError(400, "No file uploaded");
  } catch (error) {
    console.error('Upload error:', error);
    throw createError(500, error.message || "Error uploading files");
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await deleteImgFromCloudinary(id);
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  uploadImages,
  deleteImages,
};
