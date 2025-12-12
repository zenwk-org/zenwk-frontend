import Title from '@/components/modules/user/user-feed/Title';
import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon';
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
            <button
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
                <div className="rounded-lg p-3 hover:bg-gray-100">
                    <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                        <ChevronDownIcon
                            size={20}
                            sizeStroke={3}
                            className="h-4 w-4"
                        />
                    </motion.div>
                </div>
            </button>
        </AnimatePresence>
    );
};
