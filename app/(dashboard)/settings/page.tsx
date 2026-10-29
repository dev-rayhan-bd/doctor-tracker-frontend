'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { authService } from '@/features/auth/services/auth.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { KeyRound, User, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, isUpdatingProfile } = useAuth();

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (!user?._id) return;

    try {
      await updateProfile({ id: user._id, name: name.trim() });
    } catch {
      // Error handled in useAuth mutation
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast.error('Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      await authService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account & Portal Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage administrator credentials, profile parameters, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm text-center p-6 bg-card">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/25 mb-4">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <h3 className="font-bold text-lg text-foreground">{user?.name || 'Administrator'}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>

            <div className="pt-4 flex justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 text-xs">
                {user?.role || 'SYSTEM ADMIN'}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 text-xs">
                {user?.status || 'ACTIVE'}
              </Badge>
            </div>

            <div className="mt-6 pt-6 border-t text-left space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Account Clearance:</span>
                <span className="font-semibold text-foreground">Level 1 Administrative</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Access Protocols:</span>
                <span className="font-semibold text-emerald-600">Encrypted JWT</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Edit Profile Form */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5 text-blue-600">
                <User className="h-5 w-5" />
                <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Update your administrative display name and contact identity.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-name" className="text-xs font-semibold">
                    Administrator Full Name
                  </Label>
                  <Input
                    id="prof-name"
                    value={name}
                    placeholder={user?.name || 'System Admin'}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded-xl h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-email" className="text-xs font-semibold">
                    Official Email (Read-Only)
                  </Label>
                  <Input
                    id="prof-email"
                    value={user?.email || ''}
                    disabled
                    className="rounded-xl h-10 bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-muted-foreground"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Email updates require supervisor security verification.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center gap-2.5 text-blue-600">
                <KeyRound className="h-5 w-5" />
                <CardTitle className="text-lg font-bold">Change Password</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Update your account password regularly to maintain clinical data security.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="old-pass" className="text-xs font-semibold">
                    Current Password *
                  </Label>
                  <Input
                    id="old-pass"
                    type="password"
                    placeholder="••••••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="rounded-xl h-10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="chg-new-pass" className="text-xs font-semibold">
                      New Password *
                    </Label>
                    <Input
                      id="chg-new-pass"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="rounded-xl h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="chg-conf-pass" className="text-xs font-semibold">
                      Confirm New Password *
                    </Label>
                    <Input
                      id="chg-conf-pass"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="rounded-xl h-10"
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
