'use client';
import { useEffect, useState } from 'react';

import Footer from '@user/ui/user-feed/Footer';
import HeaderMenu from '@user/ui/user-feed/HeaderMenu';
import Sidebar from '@user/ui/user-feed/Sidebar';
import Spinner from '@app/shared/ui/Spinner';
import SexOptionsContextProvider from '@user/context/SexOptionsContext';

import BackgroundThemeContextProvider from './context/BackgroundThemeContext';
import { useLoadUser } from '@app/shared/hooks/useLoadUser';

export default function UserLayout({
    children,
    alignTop,
}: {
    children: React.ReactNode;
    isSidebarExpanded: boolean;
    alignTop?: boolean;
}) {
    // const { sidebarWidth } = useSidebarContext();
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
            <SexOptionsContextProvider>
                <div className="flex min-h-screen w-full flex-col bg-transparent">
                    <header className="sticky top-0 z-50 bg-blue-50/60 shadow-sm">
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
            </SexOptionsContextProvider>
        </BackgroundThemeContextProvider>
    );
}
