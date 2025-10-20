'use client';
import { useRef } from 'react';

import Link from 'next/link';
import UserProfilePhoto from '@user/components/general/UserProfilePhoto';
import LogoZenwk from '@user/components/header/LogoZenwk';
import ProfileMenu from '@user/components/header/ProfileMenu';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';

const userMenuItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Earnings', href: '#' },
    { label: 'Sign out', href: '#' },
];

/**
 * Se deshabilitan opciones de navbar.
 */
const navLinks: any[] = [
    /*{ label: "Home", href: "#", active: true },
    { label: "About", href: "#" },
    { label: "Services", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Contact", href: "#" },
*/
];

/**
 * Menú del header para usuario autenticado.
 * @param param0
 * @returns
 */
const HeaderMenu = () => {
    const avatarBtnRef = useRef<HTMLButtonElement>(null);
    const { userDTO } = useUserContext();
    const { person } = usePersonContext();
    /**
     * Pasa el evento programaticamente.
     */
    const handleChevronClick = () => {
        avatarBtnRef.current?.focus();
    };

    /**
     *  useEffect para recuperar el useJwtContext y consultar el usuario.
     **/
    //console.log('HeaderMenu: useFetchAuthenticatedUser: [OK]>');
    //const { userDTO, userData } = useFetchAuthenticatedUser();
    /**

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
        <nav className="border-b border-b-gray-300 bg-white shadow-[0_4px_5px_-4px_rgba(0,0,0,0.10)] dark:bg-gray-900">
            {/** bkp (anterior limite de la pantalla):  max-w-screen-2xl */}
            <div className="mx-auto flex flex-wrap items-center justify-between px-4 py-2">
                {/* Logo on acceso directo a inicio */}
                <LogoZenwk isToolTip={true} />

                {/* User menu & mobile toggle */}
                <div className="flex items-center space-x-3 md:order-2 md:space-x-1 rtl:space-x-reverse">
                    <ProfileMenu
                        avatarBtnRef={avatarBtnRef}
                        isPhotoProfile={isPhotoProfile}
                        userDTO={userDTO}
                        profilePicture={person?.profilePicture}
                        handleChevronClick={handleChevronClick}
                    />
                </div>

                {/* Opciones del navbar esta parte por ahora no se utiliza es posible que solo se agregue una barra de búsquedad. */}
                <div
                    className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
                    id="navbar-user"
                >
                    <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 md:dark:bg-gray-900">
                        {navLinks.length > 0 &&
                            navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className={`block rounded-sm px-3 py-2 ${
                                            link.active
                                                ? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                                                : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500'
                                        }`}
                                        aria-current={
                                            link.active ? 'page' : undefined
                                        }
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HeaderMenu;
