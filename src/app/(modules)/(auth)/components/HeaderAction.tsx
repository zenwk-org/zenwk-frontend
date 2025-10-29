'use client';

import React from 'react';
import Tooltip from '@app/shared/ui/Tooltip';
import Text from '@user/ui/user-feed/Text';
import clsx from 'clsx';

interface HeaderActionProps {
    /** Texto principal del encabezado */
    title: React.ReactNode;
    /** Texto de parrajo */
    message?: React.ReactNode;
    /** Acción que se ejecuta al hacer clic sobre el icono */
    onAction?: () => void;
    /** Texto del tooltip */
    tooltipText?: string;
    /** Tamaño opcional del texto */
    sizeOffsetTitle?: number;
    /** Tamaño opcional del texto */
    sizeOffsetMessage?: number;
    /** Variante de color del fondo del ícono */
    variant?: 'light' | 'medium';
    /** Permite reemplazar el ícono (por defecto usa ArrowBackIcon) */
    icon?: React.ReactNode;
}

/**
 * Componente genérico de encabezado con ícono de acción y texto centrado.
 * Ideal para cabeceras como "Volver", "Inicio", "Registro", etc.
 */
const HeaderAction: React.FC<HeaderActionProps> = ({
    title,
    onAction,
    tooltipText,
    sizeOffsetTitle = 80,
    sizeOffsetMessage = 23,
    variant = 'light',
    icon,
    message,
}) => {
    const bgColor =
        variant === 'light'
            ? 'bg-gray-100 hover:bg-gray-300'
            : 'bg-gray-200 hover:bg-gray-300';

    return (
        <>
            <div className="flex w-full items-center justify-center gap-6">
                {/* Si el icono se envía se muestra con su tooltip */}
                {icon && (
                    <div
                        onClick={onAction}
                        className={clsx(
                            'group relative cursor-pointer rounded-lg px-2 py-1 transition-all duration-200',
                            bgColor
                        )}
                    >
                        {icon}
                        <Tooltip position="top" hiddenArrow>
                            {tooltipText}
                        </Tooltip>
                    </div>
                )}
                {/* Titulo del paso en el flujo */}
                <Text
                    text={title}
                    className="my-2 text-center text-black"
                    sizeOffset={sizeOffsetTitle}
                />
            </div>
            {/* Si hay un parrafo descriptivo se muestra */}
            {message && (
                <Text
                    text={message}
                    sizeOffset={sizeOffsetMessage}
                    className="my-5 text-center text-gray-500"
                />
            )}
        </>
    );
};

export default HeaderAction;
