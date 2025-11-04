'use client';

import HeaderText from './(modules)/(auth)/ui/HeaderText';
import SubTitle from './(modules)/(auth)/ui/SubTitle';
import Title from './(modules)/(auth)/ui/Title';
import Footer from '@app/shared/ui/Footer';
import Header from '@app/shared/ui/Header';
import Link from 'next/link';
import { CircleX } from 'lucide-react';
import { RingLoader } from 'react-spinners';
import UserProfilePhoto from './(modules)/user/components/general/UserProfilePhoto';
import Tooltip from '@app/shared/ui/Tooltip';
import { useLoadUser } from '@app/shared/hooks/useLoadUser';
import { useLogout } from '@app/shared/hooks/useLogout';
import Text from '@user/ui/user-feed/Text';
import { UserMessages } from '@user/constants/user-messages';
import WelcomeSection from '@app/shared/components/WelcomeSection';
import UserMenu from '@user/components/general/UserMenu';
import { useUserContext } from '@user/utils/useUserContext';
import ProfileMenu from '@user/components/header/ProfileMenu';
import { useRef } from 'react';

/**
 * Página de inicio (landing principal de ZenWK)
 */
const Home = () => {
    const avatarBtnRef = useRef<HTMLButtonElement>(null);
    const { person } = useLoadUser();
    const { userDTO } = useUserContext();
    const { isLoading, handleLogout } = useLogout();

    const handleChevronClick = () => {
        avatarBtnRef.current?.focus();
    };

    /**
     * Cargar la foto el usuario o un ícono por defecto si el usuario no ha cargado una imagen.
     * @returns
     */
    const isPhotoProfile = (isOpenMenu?: boolean) => {
        return (
            <UserProfilePhoto
                isOpenMenu={isOpenMenu ?? false}
                profilePicture={person?.profilePicture}
            />
        );
    };

    return (
        // min-h-screen: ocupa todo el alto de la pantalla
        <div className="flex min-h-screen w-full flex-col bg-transparent">
            {/* HEADER FIJO */}
            <header className="h-fulll sticky top-0 z-50 bg-blue-50/60 shadow-sm backdrop-blur-sm">
                <Header
                    content={
                        <div className="flex items-center gap-1">
                            <div className="group relative flex items-center md:order-2 rtl:space-x-reverse">
                                <ProfileMenu
                                    avatarBtnRef={avatarBtnRef}
                                    isPhotoProfile={isPhotoProfile}
                                    userDTO={userDTO}
                                    profilePicture={person?.profilePicture}
                                    handleChevronClick={handleChevronClick}
                                    isFromHome={true}
                                />

                                {!userDTO && (
                                    <Tooltip position="left" hiddenArrow>
                                        Iniciar sesión
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    }
                />
            </header>

            {/* CONTENIDO PRINCIPAL FLEXIBLE */}
            <main className="mt-10 flex-1">
                <WelcomeSection />

                <div className="mx-auto max-w-[860px] bg-gray-100 px-4 py-10">
                    <Title
                        title={
                            <span className="text-cyan-800">
                                Registra tus horas de forma motivadora y con
                                retroalimentación
                            </span>
                        }
                    />

                    <SubTitle
                        text={
                            <div className="mb-10 px-10">
                                <span className="mx-2 font-normal">
                                    Optimizando el seguimiento de tiempo en
                                    empresas, emprendimientos y proyectos
                                    personales. Transformando una rutina
                                    habitualmente aburrida en una experiencia
                                    útil y enriquecedora.
                                </span>
                            </div>
                        }
                    />

                    <HeaderText
                        text={
                            <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                                <Link href="/register">
                                    <span className="mx-3 w-full rounded-3xl bg-cyan-900 px-5 py-3 font-light text-white hover:bg-cyan-950">
                                        Únete a ZenWK
                                    </span>
                                </Link>

                                <span className="rounded-3xl border-2 bg-white px-5 py-2 font-normal text-cyan-800 hover:border-gray-700 hover:bg-gray-300 hover:text-gray-700 max-[400px]:px-3 max-[400px]:py-2 max-[400px]:text-sm">
                                    Así se transforma
                                </span>
                            </div>
                        }
                    />
                </div>
            </main>

            {/* FOOTER NORMAL (no fijo) */}
            <footer className="mt-10">
                <Footer bgColor="bg-indigo-50" />
            </footer>
        </div>
    );
};

export default Home;
