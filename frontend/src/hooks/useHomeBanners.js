import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../config/axios';

export const useHomeBanners = () => {
  return useQuery({
    queryKey: ['homeBanners'],
    queryFn: () => axiosInstance.get('/home-banners'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: data => data?.data,
  });
};
