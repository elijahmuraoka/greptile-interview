'use client';

import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function LoginButton() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

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
        // TODO: render toast notifications
        if (!authenticated) {
            try {
                await signIn('github');
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                await signOut();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <Button onClick={handleClick} disabled={isLoading} variant="ghost">
            {authenticated ? (
                <>
                    <FaGithub className="mr-2" /> GitHub Logout
                </>
            ) : isLoading ? (
                <>
                    <FaGithub className="mr-2" /> Loading...
                </>
            ) : (
                <>
                    <FaGithub className="mr-2" /> GitHub Login
                </>
            )}
        </Button>
    );
}
