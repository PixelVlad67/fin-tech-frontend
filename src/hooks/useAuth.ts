import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authController } from '../api/controllers';
import { useAuthStore } from '../store/useAuthStore';
import { AuthResponse, LoginDto, RegisterDto } from '../types/api';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authController.login(data).then(res => ({ ...res, email: data.email })),
    onSuccess: (data: any) => {
      // Clear any leftover cache before setting new user
      queryClient.clear();
      
      const user = { 
        id: 'current-user', 
        email: data.email,
        name: data.email.split('@')[0] 
      };
      setAuth(user, data.access_token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authController.register(data),
    onSuccess: (data: AuthResponse) => {
      queryClient.clear();
      setAuth(data.user, data.access_token);
    },
  });

  const logout = async () => {
    // 1. Clear all React Query data from memory
    queryClient.clear();
    // 2. Remove tokens from secure storage and update Zustand
    await logoutStore();
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
