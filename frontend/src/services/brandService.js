import axiosInstance from '../config/axios';

export const brandsApi = {
  getAllBrands: async ({ page = 1, limit = 10 } = {}) => {
    try {
      const { data } = await axiosInstance.get('/brands', {
        params: {
          page,
          limit
        }
      });
      return data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  },

  getBrandById: async (id) => {
    try {
      const { data } = await axiosInstance.get(`/brands/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  }
}; 