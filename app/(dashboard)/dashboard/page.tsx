'use client';

import {
  Stethoscope,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { useDashboardAnalytics } from '@/features/analytics/hooks/use-analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CONDITION_COLORS: Record<string, string> = {
  Critical: '#ef4444', // Red
  Serious: '#f97316', // Orange
  'Under Observation': '#eab308', // Yellow
  Stable: '#3b82f6', // Blue
  Recovered: '#10b981', // Green
};

export default function DashboardPage() {
  const { data: analytics, isLoading, error } = useDashboardAnalytics();

  const kpi = analytics?.kpi;
  const charts = analytics?.charts;

  // Prepare Pie Chart data with colors
  const conditionData = (charts?.conditionDistribution || []).map((item) => ({
    name: item._id,
    value: item.count,
    color: CONDITION_COLORS[item._id] || '#6366f1',
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Administrative Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time health analytics, doctor capacity, and patient status monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/doctors"
            className={buttonVariants({
              variant: 'outline',
              className: 'gap-2 rounded-xl border-slate-300 dark:border-slate-700 shadow-sm',
            })}
          >
            <UserPlus className="h-4 w-4 text-blue-600" />
            Manage Doctors
          </Link>
          <Link
            href="/patients"
            className={buttonVariants({
              className: 'gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20',
            })}
          >
            <PlusCircle className="h-4 w-4" />
            Manage Patients
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Doctors */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Stethoscope className="h-16 w-16 text-blue-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Total Doctors
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                kpi?.totalDoctors ?? 0
              )}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Active medical specialists
            </p>
          </CardContent>
        </Card>

        {/* Total Patients */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="h-16 w-16 text-indigo-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Total Patients
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                kpi?.totalPatients ?? 0
              )}
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
              <Activity className="h-3 w-3" /> Total clinical admissions
            </p>
          </CardContent>
        </Card>

        {/* Critical Cases */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle className="h-16 w-16 text-rose-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Critical Cases
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-rose-600">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                kpi?.criticalPatients ?? 0
              )}
            </div>
            <p className="text-xs text-rose-600/80 font-medium mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        {/* Recovered / Stable */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Stable / Recovered
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">
              {isLoading ? (
                <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                (kpi?.stablePatients ?? 0) + (kpi?.recoveredPatients ?? 0)
              )}
            </div>
            <p className="text-xs text-emerald-600/80 font-medium mt-1">Healthy progression</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Bar Chart: Patients Per Doctor (Spans 4 columns) */}
        <Card className="lg:col-span-4 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Patients per Doctor</CardTitle>
            <CardDescription className="text-xs">
              Load balance and patient assignments across medical specialists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              {isLoading ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl" />
              ) : charts?.patientsPerDoctor && charts.patientsPerDoctor.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.patientsPerDoctor} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis
                      dataKey="doctorName"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="patientCount" name="Patients" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-sm font-medium text-muted-foreground">No patient assignments recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add doctors and assign patients to view statistics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart: Patient Condition Breakdown (Spans 3 columns) */}
        <Card className="lg:col-span-3 rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Patient Condition Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Current clinical severity distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              {isLoading ? (
                <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl" />
              ) : conditionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={conditionData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {conditionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center p-4">
                  <p className="text-sm font-medium text-muted-foreground">No patient records found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date-Based Trend Area Chart */}
      <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Registration & Admission Trends (Date-based)</CardTitle>
          <CardDescription className="text-xs">
            Historical timeline of incoming patients and doctor onboardings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-xl" />
            ) : charts?.dateBasedStatistics && charts.dateBasedStatistics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.dateBasedStatistics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="patientColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="doctorColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    name="Patients"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#patientColor)"
                  />
                  <Area
                    type="monotone"
                    dataKey="doctors"
                    name="Doctors"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#doctorColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm font-medium text-muted-foreground">No timeline data available</p>
                <p className="text-xs text-muted-foreground mt-1">Data will populate as records are created</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
