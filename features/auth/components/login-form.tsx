'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schemas/auth.schema';
import { useAuth } from '../hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LockKeyhole } from 'lucide-react';

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormData) => {
    login(values);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl border-slate-200/80 dark:border-slate-800 bg-card">
      <CardHeader className="space-y-2 text-center pb-6">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-foreground">
          Portal Sign In
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your authorized credentials to access clinical records and physician rosters
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Official Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@hospital.org"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
              className="rounded-xl h-11"
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
              className="rounded-xl h-11"
            />
            {errors.password && (
              <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
          <Button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 font-semibold text-white shadow-md shadow-blue-600/25 transition-all"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In to Portal'}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground">
            Protected by Healthcare Information Security & Access Controls
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
