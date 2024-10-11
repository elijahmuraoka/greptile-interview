import Link from 'next/link';
import { auth } from '@/auth';
import { LoginButton } from './login-button';
import Image from 'next/image';
import Logo from './logo';

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="absolute top-0 left-0 right-0 w-full bg-foreground text-background px-8 py-4 flex flex-row justify-between items-center drop-shadow-sm z-50">
            {/* Pages */}
            <div className="flex flex-row items-center justify-center gap-4">
                <Link href="/" className="text-foreground font-bold">
                    <Logo invert />
                </Link>
                <Link href="/dashboard">Dashboard</Link>
            </div>
            {/* User */}
            <div className="flex flex-row items-center justify-center gap-4">
                {!!session && (
                    <Image
                        src={session.user?.image!}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full shadow-md border-[1px] border-border"
                    />
                )}
                <LoginButton />
            </div>
        </nav>
    );
}
