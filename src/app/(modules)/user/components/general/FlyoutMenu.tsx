'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';

/**
 * Interface que representa los parametros usados para el componente FlyoutMenu
 */
interface Props {
    /** Botón o elemento que abre el menú */
    trigger: (props: {
        onClick: () => void;
        ref: React.Ref<HTMLButtonElement>;
    }) => ReactNode;
    /** Contenido del menú */
    children: ReactNode;
    /**  Posición relativa al trigger */
    position?: 'left' | 'right';
    /** Cerrar el menú al hacer click en una opción */
    closeOnSelect?: boolean;
}

/**
 * Componente de menú flotante que se despliega a la izquierda o derecha
 * de un elemento disparador.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {(props: { open: boolean; onToggle: () => void; ref: React.Ref<any> }) => React.ReactNode} props.trigger
 *  Función que renderiza el elemento disparador del menú.
 * @param {React.ReactNode} props.children - Contenido del menú.
 * @param {"left" | "right"} [props.position="left"] - Posición relativa al disparador.
 * @param {boolean} [props.closeOnSelect=true] - Si `true`, cierra el menú al seleccionar una opción.
 *
 * @example
 * <FlyoutMenu
 *   trigger={({ open, onToggle }) => (
 *     <button onClick={onToggle}>{open ? "Cerrar" : "Abrir"}</button>
 *   )}
 * >
 *   <ul>
 *     <li>Opción 1</li>
 *     <li>Opción 2</li>
 *   </ul>
 * </FlyoutMenu>
 */
const FlyoutMenu = ({
    trigger,
    children,
    position = 'left',
    closeOnSelect = true,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cierra el menú al presionar ESC
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    const handleItemClick = async () => {
        if (closeOnSelect) {
            // Pausa para animación
            await new Promise((resolve) => setTimeout(resolve, 300));
            setIsOpen(false);
        }
    };

    return (
        <div ref={menuRef} className="relative inline-block">
            {trigger({
                onClick: () => setIsOpen((prev) => !prev),
                ref: btnRef,
            })}
            {/* SIEMPRE montado para animar entrada/salida */}
            <div
                role="menu"
                tabIndex={0}
                aria-hidden={!isOpen}
                className={[
                    'absolute z-50 mt-2 max-w-[500px] rounded-xl border border-gray-200 bg-white',
                    'shadow-xl shadow-gray-300',
                    position === 'right'
                        ? 'right-0 origin-top-right'
                        : 'left-0 origin-top-left',
                    'transform-gpu transition-transform duration-300',
                    isOpen
                        ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                        : 'pointer-events-none -translate-y-1 scale-95 opacity-0',
                ].join(' ')}
                onClick={handleItemClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleItemClick();
                        e.preventDefault();
                    }
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default FlyoutMenu;
