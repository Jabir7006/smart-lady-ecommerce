import api from "../utils/axios";

export const uploadImages = {
  mutateAsync: async (files, type = "product") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return await api.post(`/uploads?type=${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadSingle: async (file, type = "product") => {
    const formData = new FormData();
    formData.append("image", file);

    return await api.post(`/uploads/single?type=${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
