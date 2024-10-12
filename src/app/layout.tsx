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

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} relative px-12 py-24`}>
                <Providers>
                    <Navbar />
                    <main>{children}</main>
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
