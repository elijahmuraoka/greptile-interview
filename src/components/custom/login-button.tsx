'use client';

import { Button, ButtonProps } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LoginButtonProps {
    buttonProps?: ButtonProps;
    callbackUrl?: string | null;
}

export function LoginButton({ buttonProps, callbackUrl }: LoginButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { data: session, status } = useSession();
    const { toast } = useToast();

    useEffect(() => {
        if (session?.justSignedIn) {
            console.log('User session: ', session);
            setShowToast(true);
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (showToast) {
            toast({
                description: 'You have successfully signed in.',
                variant: 'success',
            });
            setShowToast(false);
        }
    }, [showToast]);

    const handleClick = async () => {
        setIsLoading(true);
        if (!session) {
            try {
                await signIn('github', {
                    redirect: false,
                    callbackUrl: callbackUrl || '/',
                });
            } catch (err) {
                console.error(err);
                toast({
                    description: 'Failed to sign in.',
                    variant: 'destructive',
                });
            }
        } else {
            try {
                await signOut({ redirect: false });
                toast({
                    description: 'You have successfully logged out.',
                    variant: 'success',
                });
            } catch (err) {
                console.error(err);
                toast({
                    description: 'Failed to sign out.',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={isLoading || status === 'loading'}
            variant="ghost"
            {...buttonProps}
        >
            {isLoading || status === 'loading' ? (
                <>
                    <FaGithub className="mr-2 animate-spin" /> Loading...
                </>
            ) : session ? (
                <>
                    <FaGithub className="mr-2" /> Sign Out
                </>
            ) : (
                <>
                    <FaGithub className="mr-2" /> Sign In
                </>
            )}
        </Button>
    );
}
