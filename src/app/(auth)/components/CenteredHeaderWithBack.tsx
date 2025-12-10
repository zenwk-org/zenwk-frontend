'use client';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Title from '@app/app/(auth)/ui/Title';

import { useRouter } from 'next/navigation';

/**
 * Tipos de propiedades que recibe el componente `CenteredHeaderWithBack`.
 *
 * @property onBack - Función opcional que se ejecuta al hacer clic en el botón de regresar.
 * @property icon - Icono opcional a mostrar en el extremo izquierdo (por defecto un ícono de flecha hacia atrás).
 * @property children - Contenido central que usualmente es un título o encabezado.
 */
interface Props {
    onBack?: () => void;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    title?: string;
}

/**
 * Componente reutilizable que renderiza un encabezado centrado con un botón de regreso
 * (ubicado a la izquierda) que puede ejecutar una función personalizada o usar `router.back()` por defecto.
 *
 * @param props - Propiedades del componente.
 * @returns JSX.Element con diseño responsivo para encabezados con opción de retroceso.
 */
const CenteredHeaderWithBack = React.memo(
    ({ onBack, icon, children, title }: Props) => {
        const router = useRouter();

        const handleBack = () => {
            if (onBack) {
                onBack();
            } else {
                router.back();
            }
        };

        return (
            <div className="relative grid w-full place-items-center">
                {/* Ícono a la izquierda */}
                <div className="absolute top-[55%] left-5 -translate-y-1/2">
                    <button onClick={handleBack}>
                        {icon ?? <ArrowBackIcon />}
                    </button>
                </div>

                {/* Título y contenido centrado */}
                <div className="">
                    {title && <Title title={title} />}
                    {children}
                </div>
            </div>
        );
    }
);

export default CenteredHeaderWithBack;
