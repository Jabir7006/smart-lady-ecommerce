import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sizeApi } from "../services/sizeService";

export const useSizes = ({
  page = 1,
  limit = 10,
  search = "",
  sort = "createdAt",
  order = "desc",
} = {}) => {
  return useQuery({
    queryKey: ["sizes", { page, limit, search, sort, order }],
    queryFn: () => sizeApi.getAllSizes({ page, limit, search, sort, order }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sizeApi.createSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }) => sizeApi.updateSize(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sizeApi.deleteSize,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
    },
  });
};
