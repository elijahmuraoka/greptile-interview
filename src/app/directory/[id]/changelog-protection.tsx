'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ChangelogProtectionProps {
  isOwner: boolean;
  isPublished: boolean | null;
}

export default function ChangelogProtection({ isOwner, isPublished }: ChangelogProtectionProps) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOwner && !isPublished) {
      router.push('/dashboard');
      toast({
        title: 'Redirecting to dashboard...',
        description: "You don't have access to this changelog.",
        variant: 'destructive',
      });
    }
  }, [isOwner, isPublished, router, toast]);

  return null;
}
