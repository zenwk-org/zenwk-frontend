import React from 'react';
import { politiciesPassword } from '@app/app/(auth)/utils/authUtils';

interface Props {
    error?: React.ReactNode;
    isLimitWidth?: boolean;
}

/**
 * Comonente que despliega el error a nivel de campos.
 * @param param0
 * @returns
 */
const FormError = ({ error, isLimitWidth = true }: Props) => {
    return (
        <div
            className={`mt-2 mb-2 px-2 text-sm ${isLimitWidth ? 'sm:w-[400px]' : 'w-full'} ${error == 'INVALID_PASSWORD' ? 'text-emerald-700' : 'text-justify tracking-[-0.015em] text-[#E1564C] dark:text-[#E1564C]'}`}
        >
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
