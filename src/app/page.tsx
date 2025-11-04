'use client';

import Footer from '@app/shared/ui/Footer';
import Header from '@app/shared/ui/Header';
import ProfileMenu from '@user/components/header/ProfileMenu';
import UserProfilePhoto from './(modules)/user/components/general/UserProfilePhoto';
import Tooltip from '@app/shared/ui/Tooltip';
import WelcomeSection from '@app/shared/components/WelcomeSection';
import Text from '@user/ui/user-feed/Text';
import HeaderAction from '@auth/components/HeaderAction';

import { useUserContext } from '@user/utils/useUserContext';
import { useRef, useEffect, useState } from 'react';
import { useLoadUser } from '@app/shared/hooks/useLoadUser';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import LotusIcon from '@user/components/icons/LotusIcon';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Página de inicio (landing principal de ZenWK)
 */
const Home = () => {
    const avatarBtnRef = useRef<HTMLButtonElement>(null);
    const { person } = useLoadUser();
    const { userDTO } = useUserContext();
    const router = useRouter();
    const [showGuestProfile, setShowGuestProfile] = useState(false);

    const handleChevronClick = () => {
        avatarBtnRef.current?.focus();
    };

    /**
     * Este efecto controla el delay solo cuando userDTO es null
     */
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        // Para constrolar la aparición del tooltip
        timeout = setTimeout(() => {
            setShowGuestProfile(true);
        }, 100);
        setShowGuestProfile(false);
        return () => clearTimeout(timeout);
    }, [userDTO]);

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

    const onAction = () => {
        return router.push('/');
    };

    return (
        // min-h-screen: ocupa todo el alto de la pantalla
        <div className="flex min-h-screen w-full flex-col bg-transparent">
            {/* HEADER FIJO */}
            <header className="h-fulll sticky top-0 z-50 bg-blue-50/60 shadow-sm backdrop-blur-sm">
                <Header
                    content={
                        <div className="group relative flex items-center gap-1">
                            {!userDTO && showGuestProfile ? (
                                <div className="flex items-center md:order-2 rtl:space-x-reverse">
                                    <ProfileMenu
                                        avatarBtnRef={avatarBtnRef}
                                        isPhotoProfile={isPhotoProfile}
                                        userDTO={userDTO}
                                        profilePicture={person?.profilePicture}
                                        handleChevronClick={handleChevronClick}
                                        isFromHome={true}
                                    />

                                    <Tooltip position="left" hiddenArrow>
                                        Iniciar sesión
                                    </Tooltip>
                                </div>
                            ) : (
                                <ProfileMenu
                                    avatarBtnRef={avatarBtnRef}
                                    isPhotoProfile={isPhotoProfile}
                                    userDTO={userDTO}
                                    profilePicture={person?.profilePicture}
                                    handleChevronClick={handleChevronClick}
                                    isFromHome={true}
                                />
                            )}
                        </div>
                    }
                />
            </header>

            {/* Contenido */}
            <main className="mt-7 flex-1">
                {/* Encabezado del contenido */}
                <motion.header
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="mx-auto flex max-w-[470px] flex-col items-center justify-center bg-transparent p-10">
                        <LotusIcon className="mr-[0.1rem]" width={70} />
                        <HeaderAction
                            variant="xl"
                            sizeOffsetTitle={350}
                            sizeOffsetMessage={100}
                            title="Zenwk"
                            message="El mejor lugar para gestionar tu tiempo, optimizar tu equipo y alcanzar tus
                        metas con claridad y propósito."
                        />
                    </div>
                    <div className="mx-auto flex max-w-[450px] columns-2 gap-5">
                        <button
                            className="w-full"
                            onClick={() => router.push('/login')}
                        >
                            <Text
                                text="Inicia sesión"
                                sizeOffset={50}
                                className="cursor-pointer rounded-3xl bg-black p-2 text-white hover:bg-gray-500"
                            />
                        </button>
                        <button
                            className="w-full"
                            onClick={() =>
                                router.push('/register?fromHome=true')
                            }
                        >
                            <Text
                                text="Únete a Zenwk"
                                sizeOffset={50}
                                className="boder-[#365FC9] cursor-pointer rounded-3xl border-2 p-2 text-[#365FC9] hover:bg-[#A2B7E6]/20"
                            />
                        </button>
                    </div>
                </motion.header>

                <WelcomeSection />
            </main>

            {/* FOOTER NORMAL (no fijo) */}
            <footer className="mt-10">
                <Footer bgColor="bg-gray-100/70" />
            </footer>
        </div>
    );
};

export default Home;
