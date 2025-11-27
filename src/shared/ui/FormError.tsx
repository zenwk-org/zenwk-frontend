import React from 'react';
import { politiciesPassword } from '@auth/utils/authUtils';

interface Props {
    error?: React.ReactNode;
}

/**
 * Comonente que despliega el error a nivel de campos.
 * @param param0
 * @returns
 */
const FormError = ({ error }: Props) => {
    return (
        <div className="mt-2 mb-2 w-full px-2 text-sm text-[#E1564C] sm:w-[400px] dark:text-[#E1564C]">
            {error == 'INVALID_PASSWORD' ? (
                <ul className="list-inside list-disc text-sm">
                    {politiciesPassword.map((rule) => (
                        <li key={rule.id}>{rule.rule}</li>
                    ))}
                </ul>
            ) : (
                <span className="font-stretch-normal">{error}</span>
            )}
        </div>
    );
};

export default FormError;
