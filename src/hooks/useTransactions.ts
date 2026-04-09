import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsController } from '../api/controllers';
import { CreateTransactionDto, SetBudgetDto, UpdateTransactionDto } from '../types/api';

export const useTransactions = () => {
  const queryClient = useQueryClient();

  const useTransactionHistory = (params?: { startDate?: string; endDate?: string; categoryId?: string }) =>
    useQuery({
      queryKey: ['transactions', params],
      queryFn: () => transactionsController.getHistory(params),
    });

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsController.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const setBudgetMutation = useMutation({
    mutationFn: (data: SetBudgetDto) => transactionsController.setBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateTransactionDto }) => transactionsController.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (id: string) => transactionsController.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return {
    useTransactionHistory,
    createTransaction: createTransactionMutation.mutateAsync,
    isCreating: createTransactionMutation.isPending,
    setBudget: setBudgetMutation.mutateAsync,
    isSettingBudget: setBudgetMutation.isPending,
    updateTransaction: updateTransactionMutation.mutateAsync,
    isUpdating: updateTransactionMutation.isPending,
    deleteTransaction: deleteTransactionMutation.mutateAsync,
    isDeleting: deleteTransactionMutation.isPending,
  };
};
