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

/**
 * Layout para los pages de user
 * @param param0
 * @returns
 */
export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
    isSidebarExpanded: boolean;
}) {
    const { sidebarWidth } = useSidebarContext();
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const { setUserDTO } = useUserContext();
    const { setPerson } = usePersonContext();

    /**
     * useEffect que redirige a login  si no existe sesión activa.
     */
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
            } catch (error) {
                router.push('/login');
                setUserDTO(undefined);
            }
        };

        loadUser();
    }, []);

    /**
     * Bloquea scroll mientras está cargando autorización.
     * Evita warning generado en el navegador.
     */
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

    /**
     * Cargador.
     */
    if (authorized === null || !authorized) {
        return <Spinner />;
    }

    return (
        <SexOptionsContextProvider>
            <div className="flex min-h-screen flex-col bg-gray-100">
                {/* Encabezado */}
                <HeaderMenu />

                {/* Contenido con sidebar */}
                <main className="flex flex-1">
                    <Sidebar />

                    <div className="flex-1 gap-6 px-4 py-10 transition-all duration-400 ease-in-out sm:px-6 md:px-8">
                        <div>{children}</div>
                    </div>
                </main>

                {/* Pie de página */}
                <Footer style={{ marginLeft: `${sidebarWidth}px` }} />
            </div>
        </SexOptionsContextProvider>
    );
}
