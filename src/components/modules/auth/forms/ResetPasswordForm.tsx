'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { fetchJwtBaseApi } from '@/lib/shared/utils/fetchApi';
import { AuthMessages } from '@/lib/modules/auth/constants/auth-messages';

import SetPasswordUser from '@/components/modules/auth/common/SetPasswordUser';
import AnimatedPage from '@/components/modules/auth/common/AnimatedPage';

/**
 * Componente para el formulario de reingreso de contraseña en el registro del usuario.
 * si la contraseña es valida consume el api para la creación del usuario.
 * @returns - Componente JSX.
 */
const ResetPasswordForm = () => {
    const router = useRouter();
    /**
     * Recibe una contrseña válida y consume el API reset-password.
     */
    const changePassword = async (
        email: string,
        password: string,
        uuid: string,
        tokenCode: string
    ) => {
        const path = '/auth/reset-password/' + email;
        const createUserJson = {
            password: password,
            uuid: uuid,
            codeToken: tokenCode,
        };
        const result = await fetchJwtBaseApi(
            path,
            undefined,
            undefined,
            createUserJson,
            'POST'
        );

        if (result) {
            // Espera de 3 segundos
            // setTimeout(() => {
            //     return router.push('/login');
            // }, 1000);
            return router.push('/login');
        }
    };
    /** Componente JSX con el formulario para el reingreso de contraseña. */
    return (
        <AnimatedPage>
            <SetPasswordUser
                isResetPassword={true}
                title={AuthMessages.login.resetPassword.title}
                headerText={AuthMessages.login.resetPassword.title}
                buttonText={AuthMessages.buttons.saveContinue}
                onSubmitPassword={changePassword}
            />
        </AnimatedPage>
    );
};

export default ResetPasswordForm;
