import api from "../utils/axios";

export const homeBannerApi = {
  createHomeBanner: async (formData) => {
    // First upload the image if it exists
    let imageUrl = "";
    let mobile_url = "";
    let imageId = "";
    let mobile_imageId = "";

    if (formData.get("image")) {
      const imageFormData = new FormData();
      imageFormData.append("image", formData.get("image"));

      const uploadResponse = await api.post(
        "/uploads/single?type=banner ",
        imageFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(uploadResponse.data);

      imageUrl = uploadResponse.data.url;
      mobile_url = uploadResponse.data.mobile_url;
      imageId = uploadResponse.data.public_id;
      mobile_imageId = uploadResponse.data.mobile_public_id;
    }

    // Then create the banner with the image URL and ID
    const homeBannerData = {
      image: {
        url: imageUrl,
        mobile_url: mobile_url,
        public_id: imageId,
        mobile_public_id: mobile_imageId,
        alt: "home-banner",
      },
    };

    return await api.post("/home-banners", homeBannerData);
  },
  getHomeBanners: async () => {
    return await api.get("/home-banners");
  },
  deleteHomeBanner: async (id) => {
    console.log(id);
    return await api.delete(`/home-banners/${id}`);
  },
};
