import { ReactNode } from 'react';

import ProfileRingLoader from '@user/components/profile/ProfileRingLoader';
import Tooltip from '@app/shared/ui/Tooltip';
import clsx from 'clsx';
import Text from '../../ui/user-feed/Text';

/**
 * Tipo de boton usado en el page profile/edit
 * @param param0
 * @returns
 */
const ProfileButtomForm = ({
    disabled = false,
    lineLoading = false,
    buttonLoading = false,
    icon,
    text,
    shape,
    positionToltip = 'top',
    nameButtom,
    classColor = 'default',
}: {
    lineLoading?: boolean;
    buttonLoading?: boolean;
    icon: ReactNode;
    text?: string;
    shape?: 'circle' | 'square';
    positionToltip?: 'top' | 'bottom' | 'left' | 'right';
    hiddenArrow?: boolean;
    disabled?: boolean;
    nameButtom?: string;
    classColor?: 'yellow' | 'default';
}) => {
    const className = clsx(
        'group relative mt-5',
        nameButtom
            ? classColor === 'yellow'
                ? 'flex w-full items-center justify-center gap-4 bg-indigo-400 p-[0.4rem] px-4'
                : 'flex w-full items-center justify-center gap-4 bg-indigo-300 p-[0.4rem] px-4'
            : 'border-[0.1rem] border-indigo-600 bg-indigo-100 p-[0.7rem] hover:border-indigo-800 hover:bg-indigo-200',
        disabled
            ? 'cursor-not-allowed border-gray-400'
            : classColor === 'yellow'
              ? 'cursor-pointer group-hover:text-white hover:bg-indigo-500'
              : 'cursor-pointer group-hover:text-white hover:bg-indigo-400',
        shape === 'circle' && 'rounded-full',
        shape === 'square' && 'rounded-lg'
    );

    return (
        <div className={className}>
            {nameButtom && (
                <Text
                    text={nameButtom}
                    sizeOffset={0}
                    className={`font-[500] text-white ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                />
            )}
            {lineLoading && buttonLoading ? (
                <ProfileRingLoader />
            ) : (
                <span
                    className={clsx(
                        'flex items-center',
                        disabled
                            ? 'text-gray-400'
                            : 'text-gray-700 group-hover:text-black'
                    )}
                >
                    {icon}
                </span>
            )}
            {text && <Tooltip position={positionToltip}>{text}</Tooltip>}
        </div>
    );
};

export default ProfileButtomForm;
