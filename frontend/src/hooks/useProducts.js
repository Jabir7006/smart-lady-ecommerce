import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/productService';
import { useDebounce } from 'use-debounce';

export const useProducts = ({
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
}) => {
  const queryClient = useQueryClient();
  const [debouncedSearch] = useDebounce(search, 300);

  // Create a stable query key that includes all filter parameters
  const queryKey = [
    'products',
    {
      page,
      limit,
      search: debouncedSearch,
      sort,
      order,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      outOfStock,
    },
  ];

  return useQuery({
    queryKey,
    queryFn: () =>
      productsApi.getAllProducts({
        page,
        limit,
        search: debouncedSearch,
        sort,
        order,
        category,
        brand,
        minPrice,
        maxPrice,
        inStock,
        outOfStock,
      }),
    keepPreviousData: true,
  });
};

export const useProduct = id => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productsApi.getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
