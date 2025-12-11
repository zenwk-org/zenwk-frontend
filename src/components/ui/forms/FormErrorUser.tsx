import React from 'react';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import { politiciesPassword } from '@app/lib/modules/auth/utils/authUtils';

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
                    className={`mt-1 mb-[0.3] max-w-[180px] px-[0.13rem] text-left sm:max-w-[400px] ${error == 'INVALID_PASSWORD' ? 'text-emerald-700' : 'text-justify tracking-[-0.015em] text-[#E1564C]'}`}
                >
                    {error == 'INVALID_PASSWORD' ? (
                        <ul className="list-inside list-disc">
                            {politiciesPassword.map((rule) => (
                                <li key={rule.id}>{rule.rule}</li>
                            ))}
                        </ul>
                    ) : (
                        <span className="font-stretch-normal">{error}</span>
                    )}
                </div>
            }
        />
    );
};

export default FormErrorUser;
