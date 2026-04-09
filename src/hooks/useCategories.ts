import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesController } from '../api/controllers';
import { CreateCategoryDto } from '../types/api';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const useAllCategories = () =>
    useQuery({
      queryKey: ['categories'],
      queryFn: categoriesController.getAll,
    });

  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      categoriesController.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    useAllCategories,
    createCategory: createCategoryMutation.mutateAsync,
    isCreating: createCategoryMutation.isPending,
  };
};
