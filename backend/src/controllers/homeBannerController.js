const BannerSlider = require("../models/BannerSlider");
const { deleteImgFromCloudinary } = require("../utils/cloudinary");

exports.getHomeBanners = async (req, res) => {
  const banners = await BannerSlider.find();
  res.status(200).json({ banners });
};

exports.createHomeBanner = async (req, res) => {
  const { image } = req.body;

  const banner = await BannerSlider.create({ image });
  res.status(201).json({ banner });
};

exports.updateHomeBanner = async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  const banner = await BannerSlider.findByIdAndUpdate(id, { image });
  res.status(200).json({ banner });
};

exports.deleteHomeBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await BannerSlider.findById(id);
  console.log(banner);

  if (!banner) return res.status(404).json({ message: "Banner not found" });

  //delete from cloudinary
  Promise.all([
    deleteImgFromCloudinary(banner.image.public_id),
    deleteImgFromCloudinary(banner.image.mobile_public_id),
  ]);
  await BannerSlider.findByIdAndDelete(id);
  res.sendStatus(204);
};
