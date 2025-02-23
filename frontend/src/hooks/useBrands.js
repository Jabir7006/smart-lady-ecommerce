import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../services/brandService';

export const useBrands = (params = {}) => {
  const { 
    page = 1, 
    limit = 10
  } = params;

  return useQuery({
    queryKey: ['brands', { page, limit }],
    queryFn: () => brandsApi.getAllBrands({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useBrand = (id) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandsApi.getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}; 