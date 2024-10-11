import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/custom/navbar';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'AI Changelog Generator',
    description: 'Generate changelogs effortlessly with AI',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} relative`}>
                <Providers>
                    <Navbar />
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
