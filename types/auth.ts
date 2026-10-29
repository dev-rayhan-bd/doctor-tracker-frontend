import { UserRole } from '@/config/site';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  role?: UserRole;
}

