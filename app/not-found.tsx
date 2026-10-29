import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-6 text-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className={buttonVariants()}>
        Back to Home
      </Link>
    </div>
  );
}
