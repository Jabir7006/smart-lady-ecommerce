import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoryApi } from '../services/subCategoryService';

export const useSubCategories = (params = {}) => {
  return useQuery({
    queryKey: ['subcategories', params],
    queryFn: () => subCategoryApi.getAllSubCategories(params),
    keepPreviousData: true,
    staleTime: 5000,
  });
};

export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryApi.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => subCategoryApi.updateSubCategory({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['subcategory', data._id] });
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subCategoryApi.deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });
};

export const useGetSubCategory = (id) => {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: () => subCategoryApi.getSubCategory(id),
    enabled: !!id,
  });
}; 