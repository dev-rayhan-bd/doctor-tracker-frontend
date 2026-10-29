'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, Stethoscope, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  ];

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col justify-between p-4 hidden md:flex">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 px-2 text-primary">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight">DoctorTracker</span>
          </Link>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="px-2">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Portal Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              Role: {user?.role || 'User'}
            </span>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

