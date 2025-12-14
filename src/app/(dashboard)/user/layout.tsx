'use client';
import { useEffect, useState } from 'react';
import { useLoadUser } from '@/hooks/shared/useLoadUser';
import Footer from '@/components/modules/user/user-feed/Footer';
import HeaderMenu from '@/components/modules/user/user-feed/HeaderMenu';
import Sidebar from '@/components/modules/user/user-feed/Sidebar';
import Spinner from '@/components/shared/ui/Spinner';
import GenderOptionsContextProvider from '@/lib/providers/user/GenderOptionsContext';
import BackgroundThemeContextProvider from '@/lib/providers/theme/BackgroundThemeContext';

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
    isSidebarExpanded?: boolean;
}>) {
    const [visible, setVisible] = useState(false);
    const { authorized } = useLoadUser();

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    if (authorized === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Spinner />
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return (
        <BackgroundThemeContextProvider>
            <GenderOptionsContextProvider>
                <div className="flex min-h-screen w-full flex-col bg-transparent">
                    <header className="sticky top-0 z-50 bg-blue-100/60 shadow-sm shadow-blue-100/80 backdrop-blur-xs">
                        <HeaderMenu />
                    </header>
                    <div className="fixed z-40 w-full pt-13">
                        <Sidebar />
                    </div>
                    <main
                        className={`flex flex-1 transition-all duration-700 ease-in-out ${
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-[6px] opacity-0'
                        }`}
                    >
                        <div className="mx-auto justify-center px-4 sm:px-6 md:px-10">
                            {children}
                        </div>
                    </main>

                    <Footer />
                </div>
            </GenderOptionsContextProvider>
        </BackgroundThemeContextProvider>
    );
}
