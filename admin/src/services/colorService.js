import api from "../utils/axios";

export const colorApi = {
  getAllColors: async ({
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

    return await api.get(`/colors?${queryParams}`);
  },

  getColor: async (id) => {
    return await api.get(`/colors/${id}`);
  },

  createColor: async (data) => {
    return await api.post(`/colors`, data);
  },

  updateColor: async (id, data) => {
    return await api.patch(`/colors/${id}`, data);
  },

  deleteColor: async (id) => {
    return await api.delete(`/colors/${id}`);
  },
};
