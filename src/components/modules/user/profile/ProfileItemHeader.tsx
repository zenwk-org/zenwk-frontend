import React from 'react';
import Text from '@/components/shared/common/Text';
import { BarLoader } from 'react-spinners';

/**
 * Funcion que representa la linea de carga al pulsar un botón.
 * @returns
 */
export function LineLoader() {
    return (
        <div className="relative">
            <BarLoader width={'100%'} height={2} color="#007BFF" />
        </div>
    );
}

/**
 * Componente para el encabezado y la linea de carga.
 * @param param0
 * @returns
 */
const ProfileItemHeader = ({
    text,
    lineLoading,
}: {
    text?: React.ReactNode;
    lineLoading: boolean;
}) => {
    return (
        <div className="px-4">
            {text ? (
                <div>
                    <div className="bg-gradient-to-tr from-[#F8EDF3] via-white/60 to-white px-2 py-1">
                        <Text
                            text={text}
                            className="text-center leading-snug font-[300] tracking-normal text-[#B54A87]"
                            sizeOffset={0}
                        />
                    </div>
                    {lineLoading ? (
                        <LineLoader />
                    ) : (
                        <div className="h-[2px] w-full bg-gradient-to-b from-[#D08BB2]/70 shadow-md" />
                    )}
                </div>
            ) : (
                lineLoading && <LineLoader />
            )}
        </div>
    );
};

export default ProfileItemHeader;
