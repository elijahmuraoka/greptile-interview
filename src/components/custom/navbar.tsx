'use client';

import Link from 'next/link';
import { LoginButton } from './login-button';
import Logo from './logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

const allPages = ['home', 'dashboard', 'directory'];
const protectedPages = ['dashboard'];

export default function Navbar() {
    const { data: session } = useSession();

    const { toast } = useToast();

    const pathname = usePathname();
    const currPage = pathname?.split('/')[1] || 'home';
    const currPageTitle =
        currPage?.charAt(0).toUpperCase() + currPage?.slice(1);

    const navLink = (page: string) => (
        <Link
            key={page}
            href={page === 'home' ? '/' : `/${page}`}
            onClick={() => {
                if (protectedPages.includes(page) && !session) {
                    toast({
                        description:
                            'Please login first to continue to this page.',
                        variant: 'destructive',
                    });
                }
            }}
            className="text-background hover:underline transition-all duration-200"
        >
            {page.charAt(0).toUpperCase() + page.slice(1)}
        </Link>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 w-full h-16 bg-foreground text-background px-4 flex flex-row justify-between items-center drop-shadow-sm z-50">
            {/* Pages */}
            <div className="flex flex-row items-center justify-center gap-4">
                <Link href="/" className="text-foreground font-bold">
                    <Logo invert />
                </Link>
                <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger className="text-lg text-background">
                        {currPageTitle}
                    </HoverCardTrigger>
                    <HoverCardContent className="p-4 w-fit bg-foreground border-border border-2 shadow-lg">
                        <div className="flex flex-col gap-2 items-start justify-center w-fit">
                            {allPages.map((page) => {
                                if (page === currPage) return null;
                                return navLink(page);
                            })}
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
            {/* User */}
            <div className="flex flex-row items-center justify-center gap-4">
                <LoginButton
                    buttonProps={{
                        variant: 'default',
                        className: 'hover:opacity-75 ease-in-out duration-200',
                    }}
                />
                {!!session?.user && (
                    <Avatar>
                        <AvatarImage src={session.user.image!} />
                        <AvatarFallback>
                            {session.user.name?.[0].toUpperCase() ?? '?'}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </nav>
    );
}
