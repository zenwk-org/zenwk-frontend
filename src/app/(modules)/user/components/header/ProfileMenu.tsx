'use client';
import FlyoutMenu from '@user/components/general/FlyoutMenu';
import UserMenu from '@user/components/general/UserMenu';
import { UserDTO } from '@app/app/(modules)/user/types/user-dto';
import ProfileMenuTrigger from './ProfileMenuTrigger';

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
    // Función separada fuera del JSX
    const renderTrigger = (props: {
        onClick: () => void;
        ref: React.Ref<HTMLButtonElement>;
    }) => {
        return (
            <ProfileMenuTrigger
                {...props}
                isPhotoProfile={isPhotoProfile}
                avatarBtnRef={avatarBtnRef}
                userDTO={userDTO}
                isFromHome={isFromHome}
                handleChevronClick={handleChevronClick}
            />
        );
    };

    return (
        <FlyoutMenu trigger={renderTrigger} position="right">
            <UserMenu profilePicture={profilePicture} userDTO={userDTO} />
        </FlyoutMenu>
    );
};

export default ProfileMenu;
