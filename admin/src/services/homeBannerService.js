import api from "../utils/axios";

export const homeBannerApi = {
  createHomeBanner: async (formData) => {
    // First upload the image if it exists
    let imageUrl = "";
    let imageId = "";

    if (formData.get("image")) {
      const imageFormData = new FormData();
      imageFormData.append("image", formData.get("image"));

      const uploadResponse = await api.post("/uploads/single", imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      imageUrl = uploadResponse.data.url;
      imageId = uploadResponse.data.public_id;
    }

    // Then create the category with the image URL and ID
    const homeBannerData = {
      image: {
        url: imageUrl,
        public_id: imageId,
        alt: "home-banner",
      },
    };

    return await api.post("/home-banners", homeBannerData);
  },
  getHomeBanners: async () => {
    return await api.get("/home-banners");
  },
  deleteHomeBanner: async (id) => {
    return await api.delete(`/home-banners/${id}`);
  },
};
