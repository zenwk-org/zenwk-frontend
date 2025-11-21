import React from 'react';
import Text from '@user/ui/user-feed/Text';
import { TEXT_ROSA_COLOR } from '@app/styles/constans-color';

const Subtitle = ({
    text,
    isError,
    sizeOffset,
    className = 'mt-[0.6rem] mb-[0.4rem]',
}: {
    text: React.ReactNode;
    isError?: boolean;
    sizeOffset?: number;
    className?: string;
}) => {
    return (
        <div className={className}>
            <Text
                sizeOffset={sizeOffset}
                text={text}
                className={`${isError ? TEXT_ROSA_COLOR : 'font-[350] text-gray-500'}`}
            />
        </div>
    );
};

export default Subtitle;
