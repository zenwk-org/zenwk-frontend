import { useState, ReactNode } from 'react';

import Text from '@user/ui/user-feed/Text';
import ChevronDownIcon from '@user/components/icons/ChevronDownIcon';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type StatusType = 'success' | 'warning' | 'info' | null;

const statusStyles = {
    success: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-100 dark:from-emerald-900/30 dark:to-green-900/10',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    warning: {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-amber-900/30 dark:to-yellow-900/10',
        text: 'text-amber-700 dark:text-amber-300',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    },
    info: {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/10',
        text: 'text-indigo-700 dark:text-indigo-300',
        icon: <Info className="h-4 w-4 text-indigo-500" />,
    },
    null: { bg: '', text: '', icon: <></> },
};

/**
 * Componente que representa un item de configuración en la administración del perfil
 */
const ProfileItemConfiguration = ({
    text,
    setClickOption,
    isActive,
    description,
    children,
}: {
    text: ReactNode;
    setClickOption?: () => void;
    isActive: boolean;
    description?: ReactNode;
    children: React.ReactNode;
}) => {
    const [status, setStatus] = useState<StatusType>(null);

    return (
        <>
            {/* <div className="rounded-lg px-3 py-3 text-left hover:bg-[#F0F8FE]"> */}
            <div className="mb-2 px-3 py-3 text-left">
                <li
                    className="group flex cursor-pointer items-center gap-3"
                    onClick={setClickOption}
                >
                    <Text
                        sizeOffset={10}
                        text={text}
                        className={`font-[340] group-hover:text-black hover:cursor-pointer ${
                            isActive ? 'font-[340] text-black' : 'text-black'
                            // isActive ? 'font-[340] text-[#B54A87]' : 'text-black'
                        }`}
                    />

                    <div className="rounded-lg p-3 hover:bg-gray-100">
                        <ChevronDownIcon
                            size={17}
                            sizeStroke={2}
                            className={`h-4 w-4 transition-transform duration-300 group-hover:text-black ${
                                isActive
                                    ? // ? 'rotate-180 font-[340] text-[#B54A87]'
                                      'rotate-180 font-[340] text-black'
                                    : 'text-black'
                            }`}
                        />
                    </div>
                </li>
                <div
                    className={`flex items-center gap-2 rounded-md text-xs transition-all duration-500 ${
                        status ? statusStyles[status].bg : ''
                    }`}
                >
                    <span
                        className={`transition-colors ${
                            status
                                ? statusStyles[status].text
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        <Text
                            text={description}
                            className="font-[280]"
                            sizeOffset={2}
                        />
                    </span>
                </div>
            </div>

            {/* Contenido: ajustar animación de acordeón (expandir / contraer) */}
            <div
                className={`transition-[max-height,opacity] duration-500 ease-in-out ${
                    isActive ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="mx-3 rounded-lg bg-gray-50 text-gray-700 dark:text-gray-300">
                    {children}
                </div>
            </div>
        </>
    );
};

export default ProfileItemConfiguration;
