'use client';
import { useRouter } from 'next/navigation';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';
import { AuthMessages } from '@auth/constants/auth-messages';

import SetPasswordUser from '@auth/components/SetPasswordUser';

/**
 * Componente para el formulario de reingreso de contraseña en el registro del usuario.
 * si la contraseña es valida consume el api para la creación del usuario.
 * @returns - Componente JSX.
 */
const SetChangePassword = () => {
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
            setTimeout(() => {
                return router.push('/login');
            }, 1000);
        }
    };
    /** Componente JSX con el formulario para el reingreso de contraseña. */
    return (
        <SetPasswordUser
            isResetPassword={true}
            title={AuthMessages.login.resetPassword.title}
            headerText={AuthMessages.login.resetPassword.title}
            buttonText={AuthMessages.buttons.saveContinue}
            onSubmitPassword={changePassword}
        />
    );
};

export default SetChangePassword;
