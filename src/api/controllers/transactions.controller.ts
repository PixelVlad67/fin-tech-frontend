import { apiClient } from '../client';
import { Transaction, CreateTransactionDto, Budget, SetBudgetDto, UpdateTransactionDto } from '../../types/api';

export const transactionsController = {
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  setBudget: async (data: SetBudgetDto): Promise<Budget> => {
    try {
      console.log('API Request POST /transactions/budget', data);
      const response = await apiClient.post('/transactions/budget', data);
      console.log('API Response Success /transactions/budget', response.status);
      return response.data;
    } catch (error: any) {
      console.error('API Error /transactions/budget:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      throw error;
    }
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await apiClient.patch(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  getHistory: async (params?: { startDate?: string; endDate?: string; categoryId?: string }): Promise<Transaction[]> => {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  },
};
