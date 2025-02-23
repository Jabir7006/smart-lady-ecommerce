const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^(?:\+88|88)?(01[3-9]\d{8})$/,
        "Please enter a valid Bangladeshi phone number",
      ],
    },
    street: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Khulna",
        "Barisal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
      ],
    },
    postCode: {
      type: String,
      required: true,
      match: [/^\d{4}$/, "Post code must be 4 digits"],
    },
    addressType: {
      type: String,
      enum: ["Home", "Office"],
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
