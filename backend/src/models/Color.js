const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
