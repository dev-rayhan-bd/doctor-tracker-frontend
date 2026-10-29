'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '@/features/auth/services/auth.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, KeyRound, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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

  const resetAll = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setResetToken(undefined);
    setIsLoading(false);
  };

  const handleModalClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(resetAll, 200);
    }
  };

  // Step 1: Send OTP to Email
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid official email address');
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email.trim());
      toast.success('6-digit security code sent to your email');
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
      const res = await authService.verifyForgotPasswordOtp(email.trim(), otp.trim());
      if (res?.token) {
        setResetToken(res.token);
      }
      toast.success('Security code verified');
      setStep(3);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Invalid or expired security code');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;

    try {
      setIsLoading(true);
      await authService.resendOtp(email.trim());
      toast.success('New 6-digit code sent to your email');
      setResendCooldown(60);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to resend code');
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
        email: email.trim(),
        newPassword,
        confirmPassword,
        otp: otp.trim(),
        token: resetToken,
      });
      toast.success('Password updated successfully! You can now sign in.');
      handleModalClose(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader className="text-center space-y-1.5 pb-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-1">
            {step === 1 && <Mail className="h-6 w-6" />}
            {step === 2 && <KeyRound className="h-6 w-6" />}
            {step === 3 && <Lock className="h-6 w-6" />}
          </div>

          <DialogTitle className="text-xl font-bold text-center">
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Enter Verification Code'}
            {step === 3 && 'Create New Password'}
          </DialogTitle>

          <DialogDescription className="text-xs text-center">
            {step === 1 && 'Enter your hospital email to receive a password reset verification code.'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Choose a secure new password for your account.'}
          </DialogDescription>

          {/* Step indicator */}
          <div className="flex justify-center items-center gap-1.5 pt-2">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'w-6 bg-blue-600' : 'w-2 bg-muted'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'w-6 bg-blue-600' : 'w-2 bg-muted'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step === 3 ? 'w-6 bg-blue-600' : 'w-2 bg-muted'}`} />
          </div>
        </DialogHeader>

        {/* Step 1: Input Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="m-email" className="text-xs font-semibold">
                Official Email Address *
              </Label>
              <Input
                id="m-email"
                type="email"
                placeholder="doctor@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-10"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => handleModalClose(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Sending Code...' : 'Send Verification OTP'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 2: Input 6-Digit OTP & Resend */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="m-otp" className="text-xs font-semibold">
                6-Digit Security Code *
              </Label>
              <Input
                id="m-otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="rounded-xl h-11 text-center tracking-widest text-lg font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Didn&apos;t get the code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
                className="font-bold text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="m-new-pass" className="text-xs font-semibold">
                New Password *
              </Label>
              <Input
                id="m-new-pass"
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-conf-pass" className="text-xs font-semibold">
                Confirm New Password *
              </Label>
              <Input
                id="m-conf-pass"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-xl h-10"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isLoading ? 'Updating Password...' : 'Save New Password & Finish'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

