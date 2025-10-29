import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
    children: ReactNode;
    /** Controla la alineación vertical del contenido: 'center', 'start' o 'end' */
    align?: 'center' | 'start' | 'end';
}

/**
 * Componente de página animada con soporte de alineación vertical.
 */
export default function AnimatedPage({
    children,
    align = 'center',
}: AnimatedPageProps) {
    // Mapear la prop `align` a la clase Tailwind correspondiente
    const alignClass =
        align === 'start'
            ? 'items-start'
            : align === 'end'
              ? 'items-end'
              : 'items-center';

    return (
        // fixed inset-0 centra
        <motion.div
            className={`fixed inset-0 flex w-full justify-center ${alignClass} overflow-y-hidden`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
            <div className="flex flex-col">{children}</div>
        </motion.div>
    );
}
