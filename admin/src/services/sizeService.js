import api from "../utils/axios";

export const sizeApi = {
  getAllSizes: async ({
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
  }) => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(sort && { sort }),
      ...(order && { order }),
    });

    return await api.get(`/sizes?${queryParams}`);
  },

  getSize: async (id) => {
    return await api.get(`/sizes/${id}`);
  },

  createSize: async (data) => {
    return await api.post(`/sizes`, data);
  },

  updateSize: async (id, data) => {
    return await api.patch(`/sizes/${id}`, data);
  },

  deleteSize: async (id) => {
    return await api.delete(`/sizes/${id}`);
  },
};
