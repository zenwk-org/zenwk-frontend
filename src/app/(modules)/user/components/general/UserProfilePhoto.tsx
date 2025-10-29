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
            className={`h-9 w-9 rounded-full border-[0.094rem] border-black object-cover`}
            src={`data:image/jpeg;base64,${profilePicture}`}
            width={33}
            height={33}
            alt="Avatar"
        />
    ) : (
        <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-[0.094rem] border-gray-800 hover:border-[#1D4087] ${isOpenMenu ? 'bg-gray-50' : 'hover:bg-50'} `}
        >
            <User
                size={25}
                strokeWidth={1.3}
                className="text-black hover:text-[#1D4087]"
            />
        </div>
    );
};

export default UserProfilePhoto;
