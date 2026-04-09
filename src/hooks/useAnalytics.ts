import { useQuery } from '@tanstack/react-query';
import { analyticsController } from '../api/controllers';

export const useAnalytics = () => {
  const useExpensesByCategory = (params?: { startDate?: string; endDate?: string }) =>
    useQuery({
      queryKey: ['analytics', 'expenses-by-category', params],
      queryFn: () => analyticsController.getExpensesByCategory(params),
    });

  const useDashboard = () =>
    useQuery({
      queryKey: ['analytics', 'dashboard'],
      queryFn: analyticsController.getDashboard,
    });

  const useLongTerm = () =>
    useQuery({
      queryKey: ['analytics', 'long-term'],
      queryFn: analyticsController.getLongTerm,
    });

  const useTrends = (params?: { period: 'month' | 'year' }) =>
    useQuery({
      queryKey: ['analytics', 'trends', params],
      queryFn: () => analyticsController.getTrends(params),
    });

  return {
    useExpensesByCategory,
    useDashboard,
    useLongTerm,
    useTrends,
  };
};
