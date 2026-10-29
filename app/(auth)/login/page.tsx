import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your doctor tracker dashboard',
};

export default function LoginPage() {
  return <LoginForm />;
}

