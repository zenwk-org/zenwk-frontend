import React from 'react';
import clsx from 'clsx';

interface SizeMap {
    base: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

interface Props {
    text: React.ReactNode;
    sizeOffset?: number; // incremento en rem (por ejemplo 50 = 0.50 rem)
    baseSizes: SizeMap;
    className?: string;
    [key: string]: any;
}

const GenerateBaseText = ({
    text,
    sizeOffset = 0,
    baseSizes,
    className,
    ...rest
}: Props) => {
    /**
     * Función de calculo.
     * @param val
     * @returns
     */
    const calc = (val: number) => `${(val + sizeOffset / 100).toFixed(2)}rem`;

    return (
        <label
            className={clsx(
                'block leading-normal dark:text-white',
                className // si llega, se agrega; si no, no rompe lo existente
            )}
            style={{ fontSize: calc(baseSizes.base) }}
            {...rest}
        >
            <span className="sm:hidden">{text}</span>
            <span
                className="hidden sm:inline md:hidden"
                style={{ fontSize: calc(baseSizes.sm) }}
            >
                {text}
            </span>
            <span
                className="hidden md:inline lg:hidden"
                style={{ fontSize: calc(baseSizes.md) }}
            >
                {text}
            </span>
            <span
                className="hidden lg:inline xl:hidden"
                style={{ fontSize: calc(baseSizes.lg) }}
            >
                {text}
            </span>
            <span
                className="hidden xl:inline"
                style={{ fontSize: calc(baseSizes.xl) }}
            >
                {text}
            </span>
        </label>
    );
};

export default GenerateBaseText;
