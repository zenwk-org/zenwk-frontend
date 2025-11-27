import Title from '@user/ui/user-feed/Title';
import ChevronDownIcon from '@user/components/icons/ChevronDownIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const ConfigButton = ({
    text,
    isActive,
    onClick,
}: {
    text: React.ReactNode;
    isActive: boolean;
    onClick?: () => void;
}) => {
    return (
        <AnimatePresence mode="wait">
            <motion.button
                key={isActive ? 'active' : 'inactive'}
                layout="position"
                animate={{
                    x: [0, 4, 0, 0],
                }}
                transition={{
                    duration: 1.2,
                    type: 'tween',
                    ease: 'easeOut',
                }}
                onClick={onClick}
                className="group flex cursor-pointer items-center gap-3"
            >
                <Title
                    sizeOffset={10}
                    text={text}
                    className={
                        isActive
                            ? 'font-[450] text-black'
                            : 'text-gray-800 group-hover:text-black'
                    }
                />

                {/* Ícono */}
                <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="rounded-lg p-3 hover:bg-gray-100"
                >
                    <ChevronDownIcon
                        size={20}
                        sizeStroke={3}
                        className="h-4 w-4"
                    />
                </motion.div>
            </motion.button>
        </AnimatePresence>
    );
};
