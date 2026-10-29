import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HeartPulse,
  Stethoscope,
  Users,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertOctagon,
  Building,
  Lock,
  Headphones,
  HelpCircle,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const clinicalPillars = [
    {
      title: 'Specialist Directory & Staff Roster',
      desc: 'Maintain a synchronized roster of certified physicians, department assignments, and clinical availability to optimize on-call scheduling and hospital ward coverage.',
      icon: Stethoscope,
      accent: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
    },
    {
      title: 'Rapid Patient Intake & Triage Protocols',
      desc: 'Categorize incoming admissions instantaneously across five clinical triage stages: Critical, Serious, Under Observation, Stable, and Recovered.',
      icon: Users,
      accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Real-Time Capacity & Load Balancing',
      desc: 'Eliminate specialist over-allocation with MongoDB aggregation analytics. Monitor patients-per-doctor ratios, admission trends, and ward throughput live.',
      icon: TrendingUp,
      accent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'HIPAA-Aligned Governance & Audit Trails',
      desc: 'Safeguard Protected Health Information (PHI) with edge-enforced role access, encrypted session cookies, and tamper-evident administrative logs.',
      icon: ShieldCheck,
      accent: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Patient Admission & Triage',
      desc: 'Patient is registered with initial diagnosis, severity condition (Critical/Serious/Observation/Stable), and immediate contact info.',
    },
    {
      step: '02',
      title: 'Specialist Workload Assignment',
      desc: 'System cross-references department rosters and current patient counts, allocating the patient to the optimal certified physician.',
    },
    {
      step: '03',
      title: 'Ongoing Monitoring & Recovery',
      desc: 'Physicians update clinical notes, re-evaluate patient condition stages, and schedule discharge as patients recover.',
    },
    {
      step: '04',
      title: 'Aggregated Health Analytics',
      desc: 'Administrative dashboards aggregate admission curves, specialist workloads, and recovery ratios into actionable executive insights.',
    },
  ];

  const medicalDepartments = [
    'Cardiology',
    'Oncology',
    'Neurology',
    'Orthopedics',
    'Nephrology',
    'Pediatrics',
    'Internal Medicine',
    'General Surgery',
    'Emergency Medicine',
    'Pulmonology',
  ];

  const faqs = [
    {
      q: 'How does DoctorTracker prevent physician burnout?',
      a: 'The platform computes live Patients-per-Doctor analytics using MongoDB aggregation, alerting supervisors when a specialist’s caseload exceeds recommended medical limits.',
    },
    {
      q: 'Can administrators reassign patients between specialists?',
      a: 'Yes. With one click, administrators can transfer a patient to another specialist or discharge recovered patients to maintain bed capacity.',
    },
    {
      q: 'How is patient medical privacy protected?',
      a: 'DoctorTracker utilizes edge-level cookie authentication, strict role-based authorization (RBAC), and SSL/TLS encryption for all RESTful transactions.',
    },
    {
      q: 'Can we search and filter patients by severity condition?',
      a: 'Absolutely. The dedicated Patient Directory supports instant debounced search by name, phone, or diagnosis, alongside multi-condition filters (Critical, Serious, Observation, Stable, Recovered).',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 dark:bg-background">
      {/* Top Clinical Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                DoctorTracker
              </span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Clinical Healthcare Network
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className={buttonVariants({
                variant: 'ghost',
                className: 'font-semibold rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600',
              })}
            >
              Staff Sign In
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                className: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 shadow-md shadow-blue-600/20',
              })}
            >
              Access Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-5xl text-center space-y-7 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Unified Hospital Clinical & Physician Administration
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Intelligent Healthcare Staffing &{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Patient Care Coordination
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Equip clinical supervisors and administrative personnel with real-time specialist
              rosters, instantaneous patient triage categorization, and actionable operational
              analytics across hospital departments.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: 'lg',
                  className: 'gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 h-12 shadow-lg shadow-blue-600/25',
                })}
              >
                Launch Admin Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  size: 'lg',
                  variant: 'outline',
                  className: 'rounded-xl font-bold px-7 h-12 border-slate-300 dark:border-slate-700 shadow-sm',
                })}
              >
                Authorized Sign In
              </Link>
            </div>

            {/* Live Operational Metrics */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-slate-800">
              <div className="p-4 text-center">
                <p className="text-3xl font-extrabold text-blue-600">24/7</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Specialist Availability</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-3xl font-extrabold text-indigo-600">100%</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Audit-Ready Patient Log</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-3xl font-extrabold text-emerald-600">&lt; 100ms</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Query Search Latency</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">Zero</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">Friction Workflow</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Healthcare Pillars */}
        <section className="py-20 bg-card border-y">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">
                Operational Excellence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Comprehensive Hospital Administration
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Engineered specifically to solve the bottleneck of physician workload distribution
                and clinical patient monitoring.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {clinicalPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card
                    key={pillar.title}
                    className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-card"
                  >
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${pillar.accent}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                          {pillar.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pl-20">
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Clinical Patient Lifecycle Workflow */}
        <section className="py-20 bg-slate-50/60 dark:bg-slate-950/20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50/50">
                Care Coordination Protocol
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                The Clinical Operational Lifecycle
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                From emergency triage intake to physician assignment and recovery discharge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {workflowSteps.map((ws) => (
                <div
                  key={ws.step}
                  className="p-6 rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 relative"
                >
                  <span className="text-3xl font-black text-blue-600/20 dark:text-blue-400/20">
                    {ws.step}
                  </span>
                  <h3 className="text-base font-bold text-foreground">{ws.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ws.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Covered Clinical Specialties Strip */}
        <section className="py-16 bg-card border-y">
          <div className="container mx-auto px-6 max-w-5xl text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Award className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Hospital Medical Specialties Managed
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {medicalDepartments.map((dept) => (
                <span
                  key={dept}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:border-blue-400 transition-colors"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Administrative FAQ Section */}
        <section className="py-20 bg-slate-50/60 dark:bg-slate-950/20">
          <div className="container mx-auto px-6 max-w-4xl space-y-12">
            <div className="text-center space-y-3">
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">
                Help & Governance
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Administrative Questions
              </h2>
            </div>

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.q} className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h4 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-6">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Hospital Footer */}
      <footer className="border-t bg-card py-10">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-foreground text-sm">DoctorTracker Portal</span>
              <p className="text-[11px]">Next-Generation Clinical Administration Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-blue-600 transition-colors font-medium">
              Staff Sign In
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors font-medium">
              Admin Portal
            </Link>
          </div>

          <p>&copy; 2026 Clinical Systems Network. All medical records confidential & protected.</p>
        </div>
      </footer>
    </div>
  );
}
