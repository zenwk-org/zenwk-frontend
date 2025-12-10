import React from 'react';
import GenerateBaseText from '@app/app/(dashboard)/user/components/general/GenerateBaseText';

const Text = ({
    text,
    sizeOffset = 0,
    className = 'text-gray-500',
    ...rest
}: {
    text: React.ReactNode;
    sizeOffset?: number;
    className?: string;
    [key: string]: any;
}) => {
    const baseSizes = {
        base: 0.72,
        sm: 0.76,
        md: 0.8,
        lg: 0.84,
        xl: 0.88,
    };

    return (
        <GenerateBaseText
            {...rest}
            text={text}
            baseSizes={baseSizes}
            sizeOffset={sizeOffset}
            className={className}
        />
    );
};

export default Text;
