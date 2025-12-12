'use client';
import Footer from '@/components/shared/ui/Footer';
import Header from '@/components/shared/ui/Header';
import { useState, useEffect } from 'react';

/**
 * Layout general para las páginas de autenticación.
 * Incluye transición suave de aparición sin provocar scroll
 * incluso en pantallas grandes.
 */
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            <Header />

            {/* Contenedor central animado sin afectar el alto del layout */}
            <div className="relative flex flex-1 items-center justify-center">
                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                        visible
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-[10px] opacity-0'
                    }`}
                >
                    <div className="w-full max-w-[860px]">{children}</div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
