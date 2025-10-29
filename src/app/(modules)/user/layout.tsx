'use client';
import { useSidebarContext } from '@user/utils/useWidthSidebarContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Footer from '@user/ui/user-feed/Footer';
import HeaderMenu from '@user/ui/user-feed/HeaderMenu';
import Sidebar from '@user/ui/user-feed/Sidebar';
import Spinner from '@app/shared/ui/Spinner';
import SexOptionsContextProvider from '@user/context/SexOptionsContext';

import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';
import { getPerson } from '@user/utils/personUtils';

export default function UserLayout({
    children,
    alignTop,
}: {
    children: React.ReactNode;
    isSidebarExpanded: boolean;
    alignTop?: boolean;
}) {
    const { sidebarWidth } = useSidebarContext();
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const { setUserDTO } = useUserContext();
    const { setPerson } = usePersonContext();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const pathUserMe = '/users/me';
                const userData = await fetchJwtBaseApi(
                    pathUserMe,
                    undefined,
                    undefined,
                    undefined,
                    'GET'
                );
                setUserDTO(userData);
                if (userData.idPerson) {
                    const personaData = await getPerson(userData.idPerson);
                    setPerson(personaData);
                }
                setAuthorized(true);
            } catch {
                router.push('/login');
                setUserDTO(undefined);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (authorized === null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [authorized, router]);

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
        router.push('/login');
        return null;
    }

    return (
        <SexOptionsContextProvider>
            <div className="flex min-h-[100dvh] flex-col overflow-hidden">
                <HeaderMenu />

                <main className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <div
                        className={`flex flex-1 flex-col transition-all duration-700 ease-in-out ${
                            visible
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-[6px] opacity-0'
                        }`}
                    >
                        <div className="box-border flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </SexOptionsContextProvider>
    );
}
