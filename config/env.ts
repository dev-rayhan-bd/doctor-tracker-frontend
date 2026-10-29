import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default('http://localhost:5001/api/v1'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_AUTH_COOKIE_NAME: z
    .string()
    .default('doctor_tracker_token'),
  NEXT_PUBLIC_REFRESH_COOKIE_NAME: z
    .string()
    .default('doctor_tracker_refresh_token'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_AUTH_COOKIE_NAME: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME,
  NEXT_PUBLIC_REFRESH_COOKIE_NAME: process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME,
});

