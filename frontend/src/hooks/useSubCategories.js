import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axios';

export const useSubCategories = (params = {}) => {
  const { 
    page = 1, 
    limit = 100,
    search = "",
    categoryId = null 
  } = params;

  return useQuery({
    queryKey: ['subcategories', { page, limit, search, categoryId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/subcategories', {
        params: { 
          page, 
          limit, 
          search,
          ...(categoryId && { category: categoryId })
        }
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export const useSubCategory = (id) => {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/subcategories/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}; 