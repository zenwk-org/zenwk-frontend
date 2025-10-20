import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { TEXT_CYAN_COLOR, BG_CYAN_HOVER } from '@app/styles/constans-color';

interface Props {
    profilePicture?: boolean | string;
    isOpenMenu: boolean;
}

/**
 * Componente que recupera la foto del perfil del usuario y la prepara para ser usada en el componente UserMenu.tsx.
 * @param param0
 * @returns
 */
const UserProfilePhoto = ({ profilePicture, isOpenMenu }: Props) => {
    return profilePicture ? (
        <Image
            className={`${isOpenMenu ? 'h-9 w-9' : 'h-7 w-7'} rounded-full object-cover`}
            src={`data:image/jpeg;base64,${profilePicture}`}
            width={33}
            height={33}
            alt="Avatar"
        />
    ) : (
        <div
            className={`flex items-center justify-center rounded-full border-[0.093rem] border-cyan-800 ${isOpenMenu ? 'h-7 w-7 bg-[#758E9F] text-white' : 'h-6.5 w-6.5 ' + TEXT_CYAN_COLOR + ' ' + BG_CYAN_HOVER + ' hover:text-white'} `}
        >
            <User size={20} strokeWidth={1.2} />
        </div>
    );
};

export default UserProfilePhoto;
