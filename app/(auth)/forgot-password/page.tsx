'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { authService } from '@/features/auth/services/auth.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound, Lock, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid official email address');
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      toast.success('6-digit verification OTP sent to your email');
      setStep(2);
      setResendCooldown(60);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('OTP must be exactly 6 digits');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.verifyForgotPasswordOtp(email, otp);
      if (res?.token) {
        setResetToken(res.token);
      }
      toast.success('OTP verified successfully');
      setStep(3);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;

    try {
      setIsLoading(true);
      await authService.resendOtp(email);
      toast.success('New OTP sent to your email');
      setResendCooldown(60);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({
        email,
        newPassword,
        confirmPassword,
        otp,
        token: resetToken,
      });
      toast.success('Password reset successfully! Please sign in with your new credentials.');
      router.push('/login');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl border-slate-200/80 dark:border-slate-800 bg-card">
      <CardHeader className="text-center pb-4 space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          {step === 1 && <Mail className="h-6 w-6" />}
          {step === 2 && <KeyRound className="h-6 w-6" />}
          {step === 3 && <Lock className="h-6 w-6" />}
        </div>

        <CardTitle className="text-2xl font-black tracking-tight text-foreground">
          {step === 1 && 'Account Recovery'}
          {step === 2 && 'Verify Security OTP'}
          {step === 3 && 'Set New Password'}
        </CardTitle>

        <CardDescription className="text-xs text-muted-foreground">
          {step === 1 && 'Enter your registered hospital email to receive a password reset code.'}
          {step === 2 && `Enter the 6-digit code sent to ${email}`}
          {step === 3 && 'Create a strong, secure password for future portal access.'}
        </CardDescription>

        {/* Step Progress Pill Indicator */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= 1 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              step >= 2 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              step === 3 ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        </div>
      </CardHeader>

      {/* Step 1: Request OTP */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="rec-email" className="text-xs font-semibold">
                Hospital Email Address
              </Label>
              <Input
                id="rec-email"
                type="email"
                placeholder="doctor@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
            <Button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 font-semibold text-white shadow-md shadow-blue-600/20"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Security Code...' : 'Send Verification OTP'}
            </Button>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </CardFooter>
        </form>
      )}

      {/* Step 2: Verify OTP & Resend */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="rec-otp" className="text-xs font-semibold">
                6-Digit Security OTP
              </Label>
              <Input
                id="rec-otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="rounded-xl h-11 text-center tracking-widest text-lg font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Didn&apos;t receive code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
            <Button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 font-semibold text-white shadow-md shadow-blue-600/20"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying Code...' : 'Verify OTP'}
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change Email
            </button>
          </CardFooter>
        </form>
      )}

      {/* Step 3: Set New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-pass" className="text-xs font-semibold">
                New Password
              </Label>
              <Input
                id="new-pass"
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="conf-pass" className="text-xs font-semibold">
                Confirm New Password
              </Label>
              <Input
                id="conf-pass"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-xl h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 pb-6">
            <Button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 h-11 font-semibold text-white shadow-md shadow-blue-600/20 gap-2"
              disabled={isLoading}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

