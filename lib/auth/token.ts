import Cookies from 'js-cookie';
import { env } from '@/config/env';

export const getAuthToken = (): string | undefined => {
  return Cookies.get(env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
};

export const setAuthToken = (token: string, expiresDays = 7): void => {
  Cookies.set(env.NEXT_PUBLIC_AUTH_COOKIE_NAME, token, {
    expires: expiresDays,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(env.NEXT_PUBLIC_REFRESH_COOKIE_NAME);
};

export const setRefreshToken = (token: string, expiresDays = 30): void => {
  Cookies.set(env.NEXT_PUBLIC_REFRESH_COOKIE_NAME, token, {
    expires: expiresDays,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const removeAuthTokens = (): void => {
  Cookies.remove(env.NEXT_PUBLIC_AUTH_COOKIE_NAME);
  Cookies.remove(env.NEXT_PUBLIC_REFRESH_COOKIE_NAME);
};

