import { type Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '$lib/client/Navigation';
import Redux from '$lib/client/Redux';

import './layout.css';
import './layout.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'E-Commerce Demo',
    description: 'E-Commerce-esque technical assessment task'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Redux>
                    <div id="app">
                        <main className="main">
                            {children}
                        </main>
                        <Navigation />
                    </div>
                </Redux>
            </body>
        </html>
    );
}