import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/custom/navbar';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RepoLog AI',
  description: 'Generate changelogs effortlessly with AI',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="size-full mx-auto">
      <body className={`${inter.className} flex flex-col min-h-screen mx-auto`}>
        <Providers>
          <Navbar />
          <main className="mx-auto flex-1 flex flex-col py-16 px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
