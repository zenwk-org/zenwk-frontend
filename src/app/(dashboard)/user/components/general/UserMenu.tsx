'use client';

import { CircleUser, Cog, CircleX } from 'lucide-react';
import { UserMessages } from '@app/app/(dashboard)/user/constants/user-messages';
import { RingLoader } from 'react-spinners';
import { useLogout } from '@app/shared/hooks/useLogout';
import { UserDTO } from '@app/app/(dashboard)/user/types/user-dto';
import { UserStateEnum } from '@app/app/(dashboard)/user/types/user-dto';
import React, { useState } from 'react';

import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import UserProfilePhoto from '@app/app/(dashboard)/user/components/general/UserProfilePhoto';
import Link from 'next/link';

import clsx from 'clsx';

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
    const [clickProfile, setClickProfile] = useState(false);
    const [clickSettings, setClickSettings] = useState(false);
    const { handleLogout, isLoading } = useLogout();

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
    const handleClickProfile = async () => {
        if (isNotPermitted()) {
            return;
        }

        setClickProfile((prev) => !prev);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setClickProfile(false);
    };

    const handleClickSettings = async () => {
        if (isNotPermitted()) {
            return;
        }

        setClickSettings((prev) => !prev);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setClickSettings(false);
    };

    /**
     * Deshabilita la opción si no tiene el rol
     * @returns
     */
    const isNotPermitted = (): boolean => {
        if (!userDTO) {
            return true;
        }
        return userDTO.state === UserStateEnum.INCOMPLETE_PERFIL;
    };

    const classLi = clsx(
        'flex items-center px-4 py-[0.7rem]',
        isNotPermitted()
            ? 'pointer-events-none opacity-50'
            : 'cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-blue-700'
    );

    return (
        <div className="absolute right-0 z-50 mt-2 w-full min-w-[200px] rounded-xl bg-white shadow-lg">
            <ul className="">
                <li className="grid items-center justify-items-center rounded-t-xl border-b-[0.04rem] border-b-gray-300 bg-gray-100 py-4 shadow-2xs shadow-gray-200">
                    {renderProfilePhoto()}
                    <div className="mt-2 grid cursor-pointer items-center justify-items-center">
                        <Text
                            text={
                                /** Se debe implementar tabla company y relación con usuario */
                                <label className="text-black">
                                    {UserMessages.header.userMenu.company}
                                </label>
                            }
                            sizeOffset={2}
                        />
                        <Text sizeOffset={2} text={userDTO?.email} />
                    </div>
                </li>
                <div className="relative">
                    {/* Icono de candado cuando se tienen los permisos.
                                Pendiente: componentizar, creadr hoook*/}
                    {isNotPermitted() && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent">
                            {/* Icono de candado o puntero bloqueado */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-7 w-7 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m-.75 0h10.5A1.5 1.5 0 0118 12v7.5A1.5 1.5 0 0116.5 21h-9A1.5 1.5 0 016 19.5V12a1.5 1.5 0 011.5-1.5z"
                                />
                            </svg>
                        </div>
                    )}

                    {/** Item: perfil */}
                    <Link
                        href={isNotPermitted() ? '#' : '/user/profile'}
                        className=""
                    >
                        <li className={classLi}>
                            <button
                                onClick={handleClickProfile}
                                className="w-full"
                            >
                                <Text
                                    sizeOffset={5}
                                    className="font-[470]"
                                    text={
                                        <span
                                            className={`flex items-center gap-[0.3rem] ${isNotPermitted() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {clickProfile ? (
                                                <RingLoader
                                                    color="#365FC9"
                                                    size={16}
                                                    speedMultiplier={2.5}
                                                />
                                            ) : (
                                                // Ícono original
                                                <CircleUser
                                                    size={18}
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                            {
                                                UserMessages.header.userMenu
                                                    .profile
                                            }
                                        </span>
                                    }
                                />
                            </button>
                        </li>
                    </Link>
                    <li className="mx-2 border-[0.01rem] border-gray-200/70"></li>
                    {/** Item: ajustes */}
                    <Link href={isNotPermitted() ? '#' : '/user/settings'}>
                        <li className={classLi}>
                            <button
                                onClick={handleClickSettings}
                                className="w-full"
                            >
                                <Text
                                    sizeOffset={3}
                                    className="font-[470]"
                                    text={
                                        <span
                                            className={`flex items-center gap-[0.3rem] ${isNotPermitted() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {clickSettings ? (
                                                <RingLoader
                                                    color="#365FC9"
                                                    size={18}
                                                    speedMultiplier={2.5}
                                                />
                                            ) : (
                                                <Cog
                                                    size={18}
                                                    strokeWidth={2.5}
                                                />
                                            )}
                                            {
                                                UserMessages.header.userMenu
                                                    .config
                                            }
                                        </span>
                                    }
                                />
                            </button>
                        </li>
                    </Link>
                </div>
                {/** Item: cierre de sesión */}
                <li className="relative flex cursor-pointer items-center rounded-b-xl px-4 py-[0.7rem] hover:bg-gray-50">
                    <button onClick={handleLogout} className="w-full">
                        <span className="absolute top-0 left-1/2 w-[93%] -translate-x-1/2 border-t border-gray-300 shadow-[0_2px_2px_-2px_rgba(0,0,0,0.3)]" />

                        <Text
                            sizeOffset={3}
                            className="text-[#DA3125]"
                            text={
                                <span className="flex cursor-pointer items-center gap-[0.3rem]">
                                    {isLoading ? (
                                        <RingLoader
                                            color="#E1564C"
                                            size={18}
                                            speedMultiplier={2.5}
                                        />
                                    ) : (
                                        <CircleX size={18} strokeWidth={2.5} />
                                    )}
                                    {UserMessages.header.userMenu.logout}
                                </span>
                            }
                        />
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default UserMenu;
