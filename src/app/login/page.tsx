// src/app/login.tsx
'use client';

import { LoginButton } from '@/components/custom/login-button';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="w-full max-w-md bg-white border-border border-2 p-8 rounded-md shadow-md flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Developer Login</h1>
        <p className="text-muted-foreground text-center">
          Welcome to RepLog AI. Please sign in with your GitHub account to access your dashboard.
        </p>
        <LoginButton
          buttonProps={{ variant: 'default', className: 'w-full' }}
          callbackUrl={callbackUrl}
        />
        <p className="text-sm text-muted-foreground">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
