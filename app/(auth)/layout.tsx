import { ReactNode } from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50/60 dark:bg-background">
      <Link href="/" className="mb-8 flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white">
            DoctorTracker
          </span>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Healthcare Administrative Portal
          </p>
        </div>
      </Link>
      {children}
    </div>
  );
}
