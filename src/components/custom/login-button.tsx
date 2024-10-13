'use client';

import { Button, ButtonProps } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createUserAction, getUserByEmailAction } from '@/actions/userActions';

interface LoginButtonProps {
    buttonProps?: ButtonProps;
    callbackUrl?: string | null;
}

export function LoginButton({ buttonProps, callbackUrl }: LoginButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const { data: session, status } = useSession();
    const hasShownToast = useRef(false);
    const { toast } = useToast();

    useEffect(() => {
        const createUserInDatabase = async () => {
            const existingUser = await getUserByEmailAction(
                session?.user?.email!
            );
            if (!existingUser) {
                await createUserAction({
                    id: session?.user?.id!,
                    name: session?.user?.name!,
                    email: session?.user?.email!,
                    emailVerified: new Date(),
                    image: session?.user?.image!,
                });
            }
        };

        if (!hasShownToast.current && status === 'authenticated') {
            setShowToast(true);
            setIsLoading(false);
            createUserInDatabase();
            hasShownToast.current = true;
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
