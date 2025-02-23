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
  rating,
}) => {
  const queryClient = useQueryClient();

  // Debounce price changes to prevent excessive requests
  const [debouncedSearch] = useDebounce(search, 300);
  const [debouncedMinPrice] = useDebounce(minPrice, 500);
  const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

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
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      inStock,
      outOfStock,
      rating,
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
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        inStock,
        outOfStock,
      }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    onSuccess: data => {
      // Prefetch next page only if we're not filtering
      if (!search && !category && !brand && data.hasNextPage) {
        queryClient.prefetchQuery({
          queryKey: ['products', { ...queryKey[1], page: page + 1 }],
          queryFn: () =>
            productsApi.getAllProducts({ ...queryKey[1], page: page + 1 }),
          staleTime: 5 * 60 * 1000,
        });
      }

      // Batch update product cache
      queryClient.setQueriesData(['products'], oldData => {
        if (!oldData) return data;
        return {
          ...oldData,
          products: [...new Set([...oldData.products, ...data.products])],
        };
      });
    },
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
