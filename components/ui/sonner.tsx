'use client';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        className: 'font-sans text-sm rounded-xl shadow-lg border',
      }}
      {...props}
    />
  );
};
