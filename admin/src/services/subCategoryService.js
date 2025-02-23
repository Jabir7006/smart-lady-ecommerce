import api from '../utils/axios';

export const subCategoryApi = {
  getAllSubCategories: async ({ page = 1, limit = 100, search = '', category = '' }) => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(category && { category })
    });

    return await api.get(`/subcategories?${queryParams}`);
  },

  getSubCategory: async (id) => {
    return await api.get(`/subcategories/${id}`);
  },

  createSubCategory: async (data) => {
    return await api.post('/subcategories', data);
  },

  updateSubCategory: async ({ id, data }) => {
    return await api.put(`/subcategories/${id}`, data);
  },

  deleteSubCategory: async (id) => {
    return await api.delete(`/subcategories/${id}`);
  }
}; 