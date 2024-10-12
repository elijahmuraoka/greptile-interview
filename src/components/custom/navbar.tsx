'use client';

import Link from 'next/link';
import { LoginButton } from './login-button';
import Image from 'next/image';
import Logo from './logo';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const allPages = ['home', 'dashboard', 'directory'];

export default function Navbar() {
    const { data: session } = useSession();

    const pathname = usePathname();
    const currPage = pathname?.split('/')[1] || 'home';
    const currPageTitle =
        currPage?.charAt(0).toUpperCase() + currPage?.slice(1);

    const navLink = (page: string) => (
        <Link
            href={page === 'home' ? '/' : `/${page}`}
            className="text-background text-lg hover:underline transition-all duration-200"
        >
            {page.charAt(0).toUpperCase() + page.slice(1)}
        </Link>
    );

    return (
        <nav className="absolute top-0 left-0 right-0 w-full bg-foreground text-background px-8 py-4 flex flex-row justify-between items-center drop-shadow-sm z-50">
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
                <LoginButton />
                {!!session?.user && (
                    <Image
                        src={session.user.image!}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full shadow-md border-[1px] border-border"
                    />
                )}
            </div>
        </nav>
    );
}
