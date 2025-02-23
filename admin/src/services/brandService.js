import api from '../utils/axios';

export const brandApi = {
  getAllBrands: async ({ page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' }) => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(sort && { sort }),
      ...(order && { order })
    });

    return await api.get(`/brands?${queryParams}`);
  },

  getBrand: async (id) => {
    return await api.get(`/brands/${id}`);
  },

  createBrand: async (data) => {
    return await api.post(`/brands`, data);
  },

  updateBrand: async ({ id, data }) => {
    return await api.patch(`/brands/${id}`, data);
  },

  deleteBrand: async (id) => {
    return await api.delete(`/brands/${id}`);
  }
}; 