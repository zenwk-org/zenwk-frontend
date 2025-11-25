import { motion } from 'framer-motion';

interface AnimatedPageProps {
    children: React.ReactNode;
    align?: 'start' | 'center' | 'end';
}

/**
 * Componente de página animada con soporte de alineación vertical.
 */
export default function AnimatedPage({
    children,
    align = 'center',
}: AnimatedPageProps) {
    let alignClass = 'items-center';

    if (align === 'start') {
        alignClass = 'items-start';
    } else if (align === 'end') {
        alignClass = 'items-end';
    }

    return (
        <motion.div
            className={`flex h-full w-full flex-1 ${alignClass} `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
            <div className="flex flex-1 items-center justify-center">
                {children}
            </div>
        </motion.div>
    );
}
