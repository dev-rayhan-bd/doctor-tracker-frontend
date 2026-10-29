import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';
import { LoginResponseData, User } from '@/types/auth';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import { setAuthToken, removeAuthTokens } from '@/lib/auth/token';

export const authService = {
  async login(payload: LoginFormData): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.auth.login,
      payload,
    );
    const data = response.data.data;
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async register(payload: RegisterFormData): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.register,
      payload,
    );
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
    return response.data.data;
  },

  async logout(): Promise<void> {
    removeAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

