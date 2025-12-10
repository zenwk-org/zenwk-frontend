import React from 'react';
import GenerateBaseText from '@app/app/(dashboard)/user/components/general/GenerateBaseText';

interface TitleProps {
    text: React.ReactNode;
    sizeOffset?: number;
    className?: string;
}

const Title = ({ text, sizeOffset = 0, className = '' }: TitleProps) => {
    /**
     * Tamaño base parlos titulos del sistema.
     */
    const baseSizes = {
        base: 0.86,
        sm: 0.91,
        md: 0.95,
        lg: 0.99,
        xl: 1.06,
    };

    return (
        <GenerateBaseText
            text={text}
            baseSizes={baseSizes}
            sizeOffset={sizeOffset}
            className={className}
        />
    );
};

export default Title;
