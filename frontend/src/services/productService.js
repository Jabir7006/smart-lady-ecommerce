import axiosInstance from '../config/axios';

export const productsApi = {
  getAllProducts: async ({
    page = 1,
    limit = 10,
    search = '',
    sort = '',
    order = 'desc',
    category = '',
    brand = '',
    minPrice = '',
    maxPrice = '',
    inStock,
    outOfStock,
    rating,
  }) => {
    try {
      const { data } = await axiosInstance.get('/products', {
        params: {
          page,
          limit,
          search,
          sort,
          order,
          category,
          brand,
          minPrice,
          maxPrice,
          inStock,
          outOfStock,
          rating,
        },
      });
      return data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  },

  getProductById: async id => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },

  getFeaturedProducts: async () => {
    try {
      const { data } = await axiosInstance.get('/products', {
        //TODO: change to true when we have featured products
        params: {
          isFeatured: false,
          limit: 10,
        },
      });
      return data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const { data } = await axiosInstance.get('/products', {
        params: {
          category: categoryId,
          ...params,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (searchTerm, params = {}) => {
    try {
      const { data } = await axiosInstance.get('/products', {
        params: {
          search: searchTerm,
          ...params,
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};
