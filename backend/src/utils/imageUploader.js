const fs = require('fs');
const { uploadOnCloudinary } = require('./cloudinary');

const uploadImages = async (files) => {
  const urls = [];
  for (const file of files) {
    const { path } = file;
    const newpath = await uploadOnCloudinary(path);
    urls.push(newpath.url);
    fs.unlinkSync(path);
  }
  return urls;
};

module.exports = { uploadImages };
