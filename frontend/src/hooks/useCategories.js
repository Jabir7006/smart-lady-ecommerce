import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axios';

export const useCategories = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = 'createdAt',
    order = 'desc',
  } = params;

  return useQuery({
    queryKey: ['categories', { page, limit, search, sort, order }],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/categories', {
        params: { page, limit, search, sort, order },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = id => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/categories/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
