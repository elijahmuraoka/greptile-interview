'use client';

import Link from 'next/link';
import { LoginButton } from './login-button';
import Logo from './logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

const allPages = ['home', 'dashboard', 'directory'];
const protectedPages = ['dashboard'];

export default function Navbar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();

  const navLink = (page: string) => (
    <Link
      key={page}
      href={page === 'home' ? '/' : `/${page}`}
      onClick={() => {
        if (protectedPages.includes(page) && !session) {
          toast({
            description: 'Please login first to continue to this page.',
            variant: 'destructive',
          });
        }
      }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        pathname === (page === 'home' ? '/' : `/${page}`)
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-primary/10 hover:text-primary'
      }`}
    >
      {page.charAt(0).toUpperCase() + page.slice(1)}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-secondary drop-shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center justify-start">
            <div className="flex-shrink-0">
              <Link href="/" className="text-foreground font-bold">
                <Logo />
              </Link>
            </div>
            <div className="hidden md:block ml-4">
              <div className="flex items-baseline space-x-4">
                {allPages.map((page) => navLink(page))}
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            <LoginButton
              buttonProps={{
                variant: 'outline',
                className: 'mr-4 text-sm',
              }}
            />
            {!!session?.user && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image!} />
                <AvatarFallback>{session.user.name?.[0].toUpperCase() ?? '?'}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
