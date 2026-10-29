'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../services/auth.service';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';
import { getAuthToken } from '@/lib/auth/token';
import { User } from '@/types/auth';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasToken = typeof window !== 'undefined' ? !!getAuthToken() : false;

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authService.getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (data) => {
      toast.success('Logged in successfully!');
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      authService.updateProfile(id, { name }),
    onSuccess: (updatedUser) => {
      toast.success('Administrator profile updated successfully');
      // Immediately update queryClient cache so all UI components update instantly without reload!
      queryClient.setQueryData(AUTH_KEYS.me, (old: User | undefined) => {
        if (!old) return updatedUser;
        return { ...old, ...updatedUser };
      });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const logout = () => {
    queryClient.clear();
    authService.logout();
  };

  return {
    user: currentUser,
    isLoading: isUserLoading,
    isAuthenticated: !!currentUser,
    error: userError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    logout,
  };
}
