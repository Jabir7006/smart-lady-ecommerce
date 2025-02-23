import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../services/categoryService";

export const useCategories = ({
  page = 1,
  limit = 100, // Increased limit for initial load
  search = "",
  sort = "createdAt",
  order = "desc",
} = {}) => {
  return useQuery({
    queryKey: ["categories", { page, limit, search, sort, order }],
    queryFn: () =>
      categoryApi.getAllCategories({ page, limit, search, sort, order }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", data._id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useGetCategory = (id) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
};
