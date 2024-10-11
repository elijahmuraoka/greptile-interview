// src/app/login.tsx
import { LoginButton } from '@/components/custom/login-button';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-1/3 bg-white p-8 rounded-md shadow-md flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Developer Login</h1>
                <p className="text-muted-foreground">
                    Please sign in to continue.
                </p>
                <LoginButton />
            </div>
        </div>
    );
}
