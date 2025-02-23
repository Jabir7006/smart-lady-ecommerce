import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandApi } from '../services/brandService';

export const useBrands = ({ 
  page = 1, 
  limit = 10, 
  search = '', 
  sort = 'createdAt',
  order = 'desc'
} = {}) => {
  return useQuery({
    queryKey: ['brands', { page, limit, search, sort, order }],
    queryFn: () => brandApi.getAllBrands({ page, limit, search, sort, order }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandApi.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => brandApi.updateBrand({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', data._id] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandApi.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useGetBrand = (id) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandApi.getBrand(id),
    enabled: !!id,
  });
}; 