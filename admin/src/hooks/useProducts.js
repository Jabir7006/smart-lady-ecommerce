import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/productService';

// Export each hook individually
export const useProducts = ({ page, limit, search, sort, order, filters }) => {
  return useQuery({
    queryKey: ['products', { page, limit, search, sort, order, filters }],
    queryFn: () => productApi.getAllProducts({ page, limit, search, sort, order, filters }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUploadImages = () => {
  return useMutation({
    mutationFn: productApi.uploadImages,
  });
};

export const useGetProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      return await productApi.getProduct(id);
    },
    enabled: !!id,
    retry: 1,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data._id] });
    },
  });
}; 