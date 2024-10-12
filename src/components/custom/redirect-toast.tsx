// src/components/ToastNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface RedirectToastProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
    redirectTo: string;
}

export default function RedirectToast({
    title,
    description,
    variant,
    redirectTo,
}: RedirectToastProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [hasShown, setHasShown] = useState(false);

    useEffect(() => {
        if (hasShown) return;

        toast({
            title,
            description,
            variant,
        });

        setHasShown(true);

        router.push(redirectTo);
    }, []);

    return null;
}
