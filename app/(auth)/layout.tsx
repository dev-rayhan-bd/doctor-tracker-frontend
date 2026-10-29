import { ReactNode } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-6 flex items-center gap-2 text-primary">
        <Activity className="h-8 w-8" />
        <Link href="/" className="text-2xl font-black tracking-tight">
          DoctorTracker
        </Link>
      </div>
      {children}
    </div>
  );
}

