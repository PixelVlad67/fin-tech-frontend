import { apiClient } from '../client';
import { Category, CreateCategoryDto } from '../../types/api';

export const categoriesController = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },
};
