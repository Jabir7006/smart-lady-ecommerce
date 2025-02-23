const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      unique: true,
    },

    image: {
      type: String,
      default: "",
    },
   
    imageId: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#FEEFEA",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    }
  },
  { 
    timestamps: true,
  
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;






