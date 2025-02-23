const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const Size = mongoose.model("Size", sizeSchema);

module.exports = Size;
