'use client';

import { useEffect } from 'react';

/**
 * EXPERIMENTO NO UTILIZADO EN PRODUCCIÓN.
 *
 * Este componente intenta cambiar dinámicamente el favicon según el
 * `prefers-color-scheme` del sistema operativo (light / dark).
 *
 * Resultado de pruebas:
 * - Funciona correctamente en Chrome.
 * - Safari mantiene el favicon en cache y no actualiza el icono
 *   cuando cambia el tema del sistema.
 *
 * Debido al comportamiento agresivo de cache de Safari con favicons,
 * esta solución no es confiable entre navegadores y fue descartada.
 *
 * Se mantiene el código únicamente como referencia para futuras
 * pruebas o si el soporte de los navegadores mejora.
 */
export default function FaviconThemeSwitcher() {
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const setFavicon = () => {
            const icon = media.matches ? '/icon-dark.png?v=1' : '/icon.svg?v=1';

            let link = document.querySelector(
                "link[rel='icon']"
            ) as HTMLLinkElement | null;

            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }

            link.href = icon;
        };

        setFavicon();

        media.addEventListener('change', setFavicon);

        return () => {
            media.removeEventListener('change', setFavicon);
        };
    }, []);

    return null;
}
