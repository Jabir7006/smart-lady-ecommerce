const mongoose = require("mongoose");

const bannerSliderSchema = new mongoose.Schema({
  image: {
    public_id: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: "banner",
    },
  },
});

const BannerSlider = mongoose.model("BannerSlider", bannerSliderSchema);

module.exports = BannerSlider;
