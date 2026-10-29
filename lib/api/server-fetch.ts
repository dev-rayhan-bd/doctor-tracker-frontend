import { cookies } from 'next/headers';
import { env } from '@/config/env';
import { ApiResponse } from '@/types/api';

export interface ServerFetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Server-side typed fetch utility for Next.js App Router (RSC / Server Actions)
 * Supports SSR (cache: 'no-store'), SSG (cache: 'force-cache'), and ISR (next.revalidate).
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T>> {
  const { revalidate, tags, params, ...customConfig } = options;

  let url = `${env.NEXT_PUBLIC_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Get cookie in server component / server action context
  let token: string | undefined;
  try {
    const cookieStore = await cookies();
    token = cookieStore.get(env.NEXT_PUBLIC_AUTH_COOKIE_NAME)?.value;
  } catch {
    // In static rendering (SSG / build time), cookies() might not be accessible
    token = undefined;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customConfig.headers || {}),
  };

  const nextOptions: { revalidate?: number | false; tags?: string[] } = {};
  if (typeof revalidate !== 'undefined') {
    nextOptions.revalidate = revalidate;
  }
  if (tags && tags.length > 0) {
    nextOptions.tags = tags;
  }

  const res = await fetch(url, {
    ...customConfig,
    headers,
    ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

