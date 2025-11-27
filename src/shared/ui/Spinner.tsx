import React from 'react';
import { PropagateLoader } from 'react-spinners';

/**
 * Componente Spinner. Animación para indicador de carga.
 * Overlay Global de cargar: ocupa la pantalla entera, independientemente del page en el que se este.
 * @param loading
 * @returns
 */
const Spinner = () => {
    return (
        <div className="relative h-screen w-screen">
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
                <PropagateLoader
                    color="#135CDC"
                    loading
                    size={6}
                    speedMultiplier={1}
                />
            </div>
        </div>
    );
};

export default Spinner;
