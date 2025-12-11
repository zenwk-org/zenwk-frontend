import { useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ConfigButton } from '../../../../app/(dashboard)/user/ui/Buttons/ConfigButton';
import { motion, AnimatePresence } from 'framer-motion'; // ⬅️ agregado

import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';

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
    const [status] = useState<StatusType>(null);

    return (
        <>
            <div className="mb-2 px-3 py-3 text-left">
                <li>
                    <ConfigButton
                        text={text}
                        isActive={isActive}
                        onClick={setClickOption}
                    />
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
                            className="font-[400] text-gray-600/80"
                            sizeOffset={17}
                        />
                    </span>
                </div>
            </div>

            {/* Contenido animado del acordeón */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        key="accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.4, 0, 1, 1], // Lento al inicio, rápido al final
                        }}
                        className="overflow-hidden"
                    >
                        <div className="dark:text-gray-300">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfileItemConfiguration;
