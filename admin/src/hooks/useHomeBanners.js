import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homeBannerApi } from "../services/homeBannerService";

export const useCreateHomeBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeBannerApi.createHomeBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeBanners"] });
    },
  });
};

export const useHomeBanners = () => {
  return useQuery({
    queryKey: ["homeBanners"],
    queryFn: homeBannerApi.getHomeBanners,
  });
};

export const useDeleteHomeBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: homeBannerApi.deleteHomeBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeBanners"] });
    },
  });
};
