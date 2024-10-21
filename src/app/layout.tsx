import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/custom/navbar';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import MobilePage from '@/components/mobile-page';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RepLog AI',
  description: 'Import your repository and generate changelogs effortlessly with AI.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="size-full mx-auto">
      <body className={`${inter.className} flex flex-col min-h-screen mx-auto`}>
        <Providers>
          <Navbar />
          <main className="hidden md:flex mx-auto flex-1 flex flex-col py-16 px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
            {children}
          </main>
          <MobilePage />
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
