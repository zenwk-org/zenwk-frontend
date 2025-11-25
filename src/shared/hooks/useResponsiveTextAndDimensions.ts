import { useEffect, useState } from "react";

/**
 * Hook que calcula un tamaño de fuente responsivo basado en puntos de quiebre.
 * @param offset Ajuste adicional en rem.
 * @returns Objeto con tamaños de fuente responsivos.
 */
export const getResponsiveFontSizes = (offset: number = 0) => {
    const calc = (base: number) => `${(base + offset).toFixed(2)}rem`;
    return {
        base: calc(0.75),
        sm: calc(0.8),
        md: calc(0.85),
        lg: calc(0.9),
        xl: calc(1),
    };
};

/**
 * Hook que devuelve el tamaño de fuente actual según el ancho de la pantalla.
 */
export const useResponsiveFont = (offset: number = 0): string => {
    const [fontSize, setFontSize] = useState("0.85rem");

    useEffect(() => {
        const sizes = getResponsiveFontSizes(offset);
        const handleResize = () => {
            const w = window.innerWidth;
            if (w >= 1280) setFontSize(sizes.xl);
            else if (w >= 1024) setFontSize(sizes.lg);
            else if (w >= 768) setFontSize(sizes.md);
            else if (w >= 640) setFontSize(sizes.sm);
            else setFontSize(sizes.base);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [offset]);

    return fontSize;
};

/**
 * Hook que calcula dinámicamente la altura del input de acuerdo a la pantalla.
 * @param minWidth Ancho mínimo del input (por defecto 120px)
 * @returns Objeto con `height` y `minWidth` responsivos
 */
export const useResponsiveDimensions = (minWidth: number = 120) => {
    const [dimensions, setDimensions] = useState({
        height: "30px",
        minWidth: `${minWidth}px`,
    });

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            let height = "";

            if (w >= 1280) height = "35px";
            else if (w >= 1024) height = "34px";
            else if (w >= 768) height = "33px";
            else if (w >= 640) height = "31px";
            else height = "29px";

            setDimensions({ height, minWidth: `${minWidth}px` });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [minWidth]);

    return dimensions;
};

/**
 * Hook unificado que retorna fuente y dimensiones responsivas
 * ideal para inputs o selectores personalizados.
 */
export const useResponsiveStyle = (
    offset: number = 0,
    minWidth: number = 120
) => {
    const fontSize = useResponsiveFont(offset);
    const { height, minWidth: mw } = useResponsiveDimensions(minWidth);

    return {
        fontSize,
        height,
        minWidth: mw,
    };
};
