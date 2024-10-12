'use client';

import { Button, ButtonProps } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LoginButtonProps {
    buttonProps?: ButtonProps;
    callbackUrl?: string | null;
}

export function LoginButton({ buttonProps, callbackUrl }: LoginButtonProps) {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    const { toast } = useToast();

    const session = useSession();

    useEffect(() => {
        const { status } = session;
        if (status === 'authenticated') {
            setAuthenticated(true);
            setIsLoading(false);
        } else if (status === 'unauthenticated') {
            setAuthenticated(false);
            setIsLoading(false);
        } else if (status === 'loading') {
            setIsLoading(true);
        }
    }, [session]);

    const handleClick = async () => {
        if (!authenticated) {
            try {
                await signIn('github', { callbackUrl: callbackUrl || '/' });
                toast({
                    description:
                        'You have successfully authenticated by GitHub.',
                    variant: 'success',
                });
            } catch (err) {
                console.error(err);
                toast({
                    description: (err as Error).message,
                    variant: 'destructive',
                });
            }
        } else {
            try {
                await signOut();
                toast({
                    description: 'You have successfully logged out.',
                    variant: 'success',
                });
            } catch (err) {
                console.error(err);
                toast({
                    description: (err as Error).message,
                    variant: 'destructive',
                });
            }
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isLoading}
            variant="ghost"
            {...buttonProps}
        >
            {authenticated ? (
                <>
                    <FaGithub className="mr-2" /> Sign Out
                </>
            ) : isLoading ? (
                <>
                    <FaGithub className="mr-2" /> Loading...
                </>
            ) : (
                <>
                    <FaGithub className="mr-2" /> Sign In
                </>
            )}
        </Button>
    );
}
