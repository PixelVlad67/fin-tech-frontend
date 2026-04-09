import { apiClient } from '../client';
import { ExpensesByCategoryResponse, DashboardStats, LongTermStats, TrendData } from '../../types/api';

export const analyticsController = {
  getExpensesByCategory: async (params?: { startDate?: string; endDate?: string }): Promise<ExpensesByCategoryResponse> => {
    const response = await apiClient.get('/analytics/expenses-by-category', { params });
    return response.data;
  },

  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  getLongTerm: async (): Promise<LongTermStats> => {
    const response = await apiClient.get('/analytics/long-term');
    return response.data;
  },

  getTrends: async (params?: { period: 'month' | 'year' }): Promise<TrendData[]> => {
    const response = await apiClient.get('/analytics/trends', { params });
    return response.data;
  },
};
