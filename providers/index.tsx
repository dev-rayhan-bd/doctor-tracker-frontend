'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { Toaster } from '@/components/ui/sonner';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}

