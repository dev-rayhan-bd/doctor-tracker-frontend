export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DOCTOR'
  | 'USER'
  | 'PLAYER'
  | 'COACH'
  | 'GUARDIAN'
  | 'SCOUT';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  role?: UserRole;
}
