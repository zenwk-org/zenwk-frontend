'use client';
import FlyoutMenu from '@user/components/general/FlyoutMenu';
import UserMenu from '@user/components/general/UserMenu';
import { mergeRefs } from '@user/utils/utilsRef';
import { UserDTO } from '@app/app/(modules)/user/types/user-dto';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface Props {
    isPhotoProfile: () => React.ReactNode;
    handleChevronClick: () => void;
    avatarBtnRef: React.Ref<HTMLButtonElement>;
    userDTO?: UserDTO;
    profilePicture?: boolean | string;
    isFromHome?: boolean;
}

/**
 * Componente para el boton de configuración del perfil.
 * @param param0
 * @returns
 */
const ProfileMenu = ({
    isPhotoProfile,
    handleChevronClick,
    avatarBtnRef,
    userDTO,
    profilePicture,
    isFromHome = false,
}: Props) => {
    const router = useRouter();
    return (
        <FlyoutMenu
            trigger={({ onClick, ref }) => (
                <div className="flex gap-1">
                    {/* Icono > para desplegar menu de opciones de usuario */}
                    {!isFromHome ? (
                        <button
                            type="button"
                            tabIndex={0}
                            ref={mergeRefs(ref, avatarBtnRef)}
                            className="flex cursor-pointer rounded-full bg-gradient-to-r from-gray-100 to-gray-200 transition-shadow duration-300 hover:ring-4 hover:ring-[#C7D3F0] focus:ring-4 focus:ring-[#C7D3F0] focus:outline-none"
                            onClick={onClick}
                        >
                            {isPhotoProfile()}
                        </button>
                    ) : (
                        <button
                            type="button"
                            tabIndex={0}
                            className="flex cursor-pointer rounded-full bg-gradient-to-r from-gray-100 to-gray-200 transition-shadow duration-300 hover:ring-4 hover:ring-[#C7D3F0] focus:ring-4 focus:ring-[#C7D3F0] focus:outline-none"
                            onClick={() =>
                                userDTO
                                    ? router.push('/user')
                                    : router.push('/login')
                            }
                        >
                            {isPhotoProfile()}
                        </button>
                    )}
                    {userDTO && (
                        <button
                            className={`cursor-pointer text-black transition-transform duration-300 hover:scale-130`}
                            onClick={() => {
                                handleChevronClick();
                                onClick();
                            }}
                        >
                            <ChevronDown size={15} strokeWidth={1.8} />
                        </button>
                    )}
                </div>
            )}
            position="right"
        >
            <UserMenu profilePicture={profilePicture} userDTO={userDTO} />
        </FlyoutMenu>
    );
};

export default ProfileMenu;
