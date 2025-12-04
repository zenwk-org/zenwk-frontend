'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

type AlertProps = {
    children: React.ReactNode;
    duration?: number; // en segundos
    position?: 'top' | 'bottom'; // posición flotante
    type?: 'default' | 'user_settings';
};

const AlertInfo = ({
    type = 'default',
    children,
    duration = 2,
    position = 'top',
}: AlertProps) => {
    const [visible, setVisible] = useState(true);

    const classAlertInfo = clsx(
        'fixed left-1/2 z-50 min-w-[200px] -translate-x-1/2 rounded-xl bg-[#EBF9F0] px-5 py-3 text-center text-emerald-700 backdrop-blur-md',
        type === 'user_settings' ? 'max-w-[360px]' : 'max-w-[450px]'
    );

    useEffect(() => {
        if (duration < 0.1) duration = 0.1;
        const timer = setTimeout(() => setVisible(false), duration * 1000);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: position === 'top' ? -25 : 25,
                        scale: 0.97,
                        filter: 'blur(6px)',
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        transition: {
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1], // ease-in-out suave
                        },
                    }}
                    exit={{
                        opacity: 0,
                        y: position === 'top' ? -20 : 20,
                        scale: 0.96,
                        filter: 'blur(4px)',
                        transition: {
                            duration: 1.2, // salida más lenta
                            ease: [0.4, 0, 0.2, 1], // ease-out natural
                        },
                    }}
                    className={` ${classAlertInfo} ${position === 'top' ? 'top-4' : 'bottom-6'}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertInfo;
