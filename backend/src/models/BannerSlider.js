const mongoose = require("mongoose");

const bannerSliderSchema = new mongoose.Schema({
  image: {
    public_id: {
      type: String,
      required: true,
    },
    mobile_public_id: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    mobile_url: {
      type: String,

    },
    alt: {
      type: String,
      default: "banner",
    },
  },
});

const BannerSlider = mongoose.model("BannerSlider", bannerSliderSchema);

module.exports = BannerSlider;
