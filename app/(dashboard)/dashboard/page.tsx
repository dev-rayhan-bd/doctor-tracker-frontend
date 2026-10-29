import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Users, Calendar, Activity } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Doctors', value: '24', icon: Stethoscope, change: '+2 this month' },
    { title: 'Total Patients', value: '1,420', icon: Users, change: '+12% from last month' },
    { title: 'Active Appointments', value: '58', icon: Calendar, change: '14 today' },
    { title: 'Platform Status', value: 'Healthy', icon: Activity, change: 'API connected' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground text-sm">
          Welcome to the Doctor Tracker enterprise portal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

