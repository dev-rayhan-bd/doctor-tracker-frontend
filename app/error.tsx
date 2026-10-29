'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = '/')} variant="outline">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

