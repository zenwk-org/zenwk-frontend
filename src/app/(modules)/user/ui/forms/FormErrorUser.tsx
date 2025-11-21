import React from 'react';
import Text from '@user/ui/user-feed/Text';
import { TEXT_ROSA_COLOR } from '@app/styles/constans-color';

interface Props {
    error?: React.ReactNode;
    sizeOffset?: number;
}

/**
 * Comonente que despliega el error a nivel de campos.
 * @param param0
 * @returns
 */
const FormErrorUser = ({ error, sizeOffset }: Props) => {
    return (
        <Text
            sizeOffset={sizeOffset}
            text={
                <div
                    className={`mb-[0.3] px-[0.13rem] text-left ${TEXT_ROSA_COLOR} dark:text-red-500`}
                >
                    {error}
                </div>
            }
        />
    );
};

export default FormErrorUser;
