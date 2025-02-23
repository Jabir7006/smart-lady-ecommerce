import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colorApi } from "../services/colorService";

export const useColors = ({
  page = 1,
  limit = 10,
  search = "",
  sort = "createdAt",
  order = "desc",
} = {}) => {
  return useQuery({
    queryKey: ["colors", { page, limit, search, sort, order }],
    queryFn: () => colorApi.getAllColors({ page, limit, search, sort, order }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: colorApi.createColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }) => colorApi.updateColor(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: colorApi.deleteColor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colors"] });
    },
  });
};

export const useGetColor = (id) => {
  return useQuery({
    queryKey: ["color", id],
    queryFn: () => colorApi.getColor(id),
    enabled: !!id,
  });
};
