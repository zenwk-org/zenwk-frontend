import { UserDTO } from '@/lib/modules/user/types/user-dto';
import { mergeRefs } from '@/lib/modules/user/utils/utilsRef';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface ProfileMenuTriggerProps {
    onClick: () => void;
    ref: React.Ref<HTMLButtonElement>;
    isPhotoProfile: () => React.ReactNode;
    avatarBtnRef: React.Ref<HTMLButtonElement>;
    userDTO?: UserDTO;
    isFromHome?: boolean;
    handleChevronClick: () => void;
}

const ProfileMenuTrigger = ({
    onClick,
    ref,
    isPhotoProfile,
    avatarBtnRef,
    userDTO,
    isFromHome = false,
    handleChevronClick,
}: ProfileMenuTriggerProps) => {
    const router = useRouter();
    return (
        <div className="flex gap-1">
            {!isFromHome ? (
                <button
                    type="button"
                    tabIndex={0}
                    ref={mergeRefs(ref, avatarBtnRef)}
                    className="flex cursor-pointer rounded-full bg-gradient-to-r from-gray-100 to-gray-200 transition-shadow duration-300 hover:ring-4 hover:ring-indigo-300 focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                    onClick={onClick}
                >
                    {isPhotoProfile()}
                </button>
            ) : (
                <button
                    type="button"
                    tabIndex={0}
                    ref={mergeRefs(ref, avatarBtnRef)}
                    className="flex cursor-pointer rounded-full bg-gradient-to-r from-gray-100 to-gray-200 transition-shadow duration-300 hover:ring-4 hover:ring-indigo-300 focus:ring-4 focus:ring-indigo-300 focus:outline-none"
                    onClick={() =>
                        userDTO ? router.push('/user') : router.push('/login')
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
    );
};

export default ProfileMenuTrigger;
