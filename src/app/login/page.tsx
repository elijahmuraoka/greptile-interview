// src/app/login.tsx
'use client';

import { LoginButton } from '@/components/custom/login-button';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-1/3 bg-white border-border border-2 p-8 rounded-md shadow-md flex flex-col items-center justify-center gap-4">
                <h1 className="text-3xl font-bold">Developer Login</h1>
                <p className="text-muted-foreground">
                    Please sign in to continue.
                </p>
                <LoginButton
                    buttonProps={{ variant: 'default' }}
                    callbackUrl={callbackUrl}
                />
            </div>
        </div>
    );
}
