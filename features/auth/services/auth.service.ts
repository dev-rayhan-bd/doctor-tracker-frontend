import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';
import { LoginResponseData, User } from '@/types/auth';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import { setAuthToken, setRefreshToken, removeAuthTokens } from '@/lib/auth/token';

export const authService = {
  async login(payload: LoginFormData): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.auth.login,
      payload,
    );
    const data = response.data.data;
    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
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

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  async verifyForgotPasswordOtp(email: string, otp: string): Promise<{ token?: string }> {
    const response = await apiClient.post<ApiResponse<{ token?: string }>>(
      API_ENDPOINTS.auth.verifyForgotPasswordOtp,
      { email, otp },
    );
    return response.data.data;
  },

  async resendOtp(email: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.resendOtp, { email });
  },

  async resetPassword(payload: {
    email: string;
    newPassword: string;
    confirmPassword: string;
    otp?: string;
    token?: string;
  }): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.resetPassword, payload);
  },

  async changePassword(payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.changePassword, payload);
  },

  async updateProfile(id: string, payload: { name: string }): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      API_ENDPOINTS.auth.updateProfile(id),
      payload,
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    removeAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};
