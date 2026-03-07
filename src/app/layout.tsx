import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import '@/styles/globals.css';

import WidthSidebarContextProvider from '@/lib/providers/theme/WidthSidebarContext';
import PersonContextProvider from '@/lib/providers/user/PersonContext';
import UserContextProvider from '@/lib/providers/auth/UserContext';
import FaviconThemeSwitcher from '@/components/shared/ui/FaviconThemeSwitcher';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Zenwk',
        template: '%s',
    },
    description: 'Zenwk platform',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <link rel="icon" href="/icon.svg?v=1" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <body className={roboto.className}>
                <WidthSidebarContextProvider>
                    <UserContextProvider>
                        <PersonContextProvider>
                            <FaviconThemeSwitcher />
                            {children}
                        </PersonContextProvider>
                    </UserContextProvider>
                </WidthSidebarContextProvider>
            </body>
        </html>
    );
}
