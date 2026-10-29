import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, ShieldCheck, Zap, Database, ArrowRight, Layers } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Server & Static Rendering (SSR/SSG)',
      desc: 'Native Next.js App Router RSC with ISR tags and on-demand revalidation via serverFetch helper.',
      icon: Zap,
    },
    {
      title: 'TanStack Query (React Query)',
      desc: 'Optimistic updates, window revalidation, auto-caching, and mutation hooks for client components.',
      icon: Layers,
    },
    {
      title: 'Type-Safe API & Zod Validation',
      desc: 'Strict end-to-end TypeScript interfaces matching backend models and Zod runtime schema validation.',
      icon: Database,
    },
    {
      title: 'Enterprise Auth & Middleware',
      desc: 'Edge-compatible route protection, HTTP-only cookie synchronization, and role-based access control.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Activity className="h-6 w-6" />
            <span>DoctorTracker</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
              Sign In
            </Link>
            <Link href="/dashboard" className={buttonVariants()}>
              Open Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-28 text-center px-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            <Badge variant="outline" className="px-3 py-1 text-sm border-primary/30 text-primary">
              Enterprise Next.js 16 + React 19 + Shadcn UI
            </Badge>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Enterprise Frontend Architecture for{' '}
              <span className="text-primary">Doctor & Patient Portal</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modular vertical-slice feature architecture, fully-typed API clients,
              dynamic SSR/SSG caching, and secure role-based routing.
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/dashboard" className={buttonVariants({ size: 'lg', className: 'gap-2' })}>
                Explore Portal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                Access Account
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30 border-y">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Production-Ready Architecture
              </h2>
              <p className="text-sm text-muted-foreground">
                Designed to scale effortlessly with your Express/MongoDB backend.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="bg-card">
                    <CardHeader>
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{feature.desc}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Doctor Tracker Portal &copy; 2026 - Enterprise Next.js Architecture
      </footer>
    </div>
  );
}
