import { apiClient } from '../client';
import { AuthResponse, RegisterDto, LoginDto } from '../../types/api';

export const authController = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  refresh: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};
