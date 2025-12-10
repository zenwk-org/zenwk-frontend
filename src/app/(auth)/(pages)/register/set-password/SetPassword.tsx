'use client';

import React from 'react';
import { fetchJwtBaseApi, fetchTokenCrsfApi } from '@app/helpers/fetch-api';
import SetPasswordUser from '@app/app/(auth)/components/SetPasswordUser';
import { AuthMessages } from '@app/app/(auth)/constants/auth-messages';
import { useRouter } from 'next/navigation';
import { loginApi } from '@app/app/(auth)/utils/authUtils';

import AnimatedPage from '@app/app/(auth)/components/AnimatedPage';

/**
 * Componente para el formulario de reingreso de contraseña en el registro del usuario,
 * si la contraseña es valida consume el api de creación de usuario.
 * @returns - Componente JSX.
 */
const SetPasswordRegister = () => {
    const router = useRouter();
    /**
     * Recibe una contrseña válida y consume el API de registro de usuario.
     */
    const createRegister = async (email: string, password: string) => {
        const path = '/users';
        const createUserJson = {
            username: email.split('@')[0],
            password: password,
            email,
        };

        try {
            // Consumo api creación usuario
            const result = await fetchJwtBaseApi(
                path,
                undefined,
                undefined,
                createUserJson,
                'POST'
            );

            if (result) {
                // Paso 1:  cookie httpOnly para CSRF token
                await fetchTokenCrsfApi(email);
                // Paso 2:  cookie httpOnly para jwt token
                const res = await loginApi(email, password);
                if (res) {
                    // Pausa para mejorar la interacción con el usuario
                    // await new Promise((resolve) => setTimeout(resolve, 500));
                    router.push('/user');
                }
            }
        } catch {}
    };
    /** Componente JSX con el formulario para el reingreso de contraseña. */
    return (
        <AnimatedPage>
            <SetPasswordUser
                title={AuthMessages.register.enterPassword}
                headerText={AuthMessages.setPassword.title}
                buttonText={AuthMessages.register.linkText}
                onSubmitPassword={createRegister}
            />
        </AnimatedPage>
    );
};

export default SetPasswordRegister;
