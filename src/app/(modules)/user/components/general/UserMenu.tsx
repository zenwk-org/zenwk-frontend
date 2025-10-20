'use client';

import { CircleUser, Cog, LoaderCircle, CircleX } from 'lucide-react';
import { UserMessages } from '@user/constants/user-messages';
import { TEXT_ROSA_COLOR, TEXT_BLUE_COLOR } from '@app/styles/constans-color';
import { RingLoader } from 'react-spinners';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';

import { useRouter } from 'next/navigation';
import { UserDTO } from '@app/app/(modules)/user/types/user-dto';
import React, { useState } from 'react';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';

import Text from '@user/ui/user-feed/Text';
import UserProfilePhoto from '@user/components/general/UserProfilePhoto';
import Link from 'next/link';
import { unescape } from 'querystring';

/**
 * Interface que representa los props usados por el componente.
 */
interface Props {
    profilePicture?: boolean | string;
    userDTO?: UserDTO;
    isPhotoMenuOpen?: boolean;
}

/**
 * Menú flotante  para el botón user profile del usuario en el header.
 * @param param0
 * @returns
 */
const UserMenu = ({
    profilePicture,
    userDTO,
    isPhotoMenuOpen = true,
}: Props) => {
    const [click, setClick] = useState(false);
    const [clickProfile, setClickProfile] = useState(false);
    const router = useRouter();
    const { setUserDTO } = useUserContext();
    const { setPerson } = usePersonContext();

    /**
     * Manejador para el logOut
     */
    const handleClicLogOut = async () => {
        try {
            setClick((prev) => !prev);

            const path = '/auth/logout';
            const res = await fetchJwtBaseApi(
                path,
                undefined,
                undefined,
                undefined,
                'DELETE'
            );
            // Se actualiza el contexto
            setUserDTO(undefined);
            setPerson(undefined);
        } catch (error) {
        } finally {
            // Pausa, para animación
            await new Promise((resolve) => setTimeout(resolve, 500));
            router.push('/login');
        }
    };

    /**
     * Genera botón de user profile.
     * @returns
     */
    const renderProfilePhoto = () => {
        return (
            <UserProfilePhoto
                isOpenMenu={isPhotoMenuOpen}
                profilePicture={profilePicture}
            />
        );
    };

    /**
     * Animación click en Icono.
     */
    const handleClick = async () => {
        setClickProfile((prev) => !prev);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setClickProfile(false);
    };

    return (
        <ul className="select-none">
            <li className="grid items-center justify-items-center rounded-t-xl border-b-[0.04rem] border-b-gray-300 bg-gray-100 py-4 shadow-2xs shadow-gray-200">
                {renderProfilePhoto()}
                <div className="mt-2 grid cursor-pointer items-center justify-items-center">
                    <Text
                        text={
                            /** Se debe implementar tabla company y relación con usuario */
                            <label className="font-normal text-black">
                                {UserMessages.header.userMenu.company}
                            </label>
                        }
                        sizeOffset={-5}
                    />
                    <Text
                        sizeOffset={-8}
                        text={
                            <label className="font-light">
                                {userDTO?.email}
                            </label>
                        }
                    />
                </div>
            </li>
            {/** Item: perfil */}
            <Link href="/user/profile">
                <li
                    className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                    onClick={handleClick}
                >
                    <Text
                        sizeOffset={-5}
                        text={
                            <span className="flex items-center gap-x-1 text-cyan-950">
                                {clickProfile ? (
                                    <RingLoader
                                        color="#000000"
                                        size={17}
                                        speedMultiplier={1.5}
                                    />
                                ) : (
                                    // Ícono original
                                    <CircleUser size={17} strokeWidth={1.4} />
                                )}
                                {UserMessages.header.userMenu.profile}
                            </span>
                        }
                    />
                </li>
            </Link>
            {/** Item: ajustes */}
            <li className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100">
                <Text
                    sizeOffset={-5}
                    text={
                        <span
                            className={`flex items-center gap-x-1 ${TEXT_BLUE_COLOR}`}
                        >
                            <Cog size={17} strokeWidth={1.4} />
                            {UserMessages.header.userMenu.config}
                        </span>
                    }
                />
            </li>
            {/** Item: cierre de sesión */}
            <li
                className="relative flex cursor-pointer items-center rounded-b-xl px-4 py-3 hover:bg-gray-100"
                onClick={handleClicLogOut}
            >
                <span className="absolute top-0 left-1/2 w-[93%] -translate-x-1/2 border-t border-gray-300 shadow-[0_2px_2px_-2px_rgba(0,0,0,0.2)]" />

                <Text
                    sizeOffset={-5}
                    text={
                        <span
                            className={`flex cursor-pointer items-center gap-x-1 ${
                                TEXT_ROSA_COLOR
                            }`}
                        >
                            {click ? (
                                <RingLoader
                                    color="#E1564C"
                                    size={17}
                                    speedMultiplier={1.5}
                                />
                            ) : (
                                // Ícono original
                                <CircleX size={17} strokeWidth={1.7} />
                            )}
                            {UserMessages.header.userMenu.logout}
                        </span>
                    }
                />
            </li>
        </ul>
    );
};

export default UserMenu;
