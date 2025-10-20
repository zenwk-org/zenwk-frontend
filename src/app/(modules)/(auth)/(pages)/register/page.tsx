'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import {
    fetchTokenApi,
    fetchValidateRegisterEmail,
} from '@app/helpers/fetch-api';
import { AuthMessages } from '@auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';

import HeaderText from '@app/app/(modules)/(auth)/ui/HeaderText';
import Title from '@app/app/(modules)/(auth)/ui/Title';
import FormInput from '@app/app/(modules)/(auth)/ui/FormInput';
import FormError from '@app/shared/ui/FormError';
import CenteredHeaderWithBack from '@auth/components/CenteredHeaderWithBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadButton from '@auth/components/LoadButton';

/**
 * Registro del usuario, renderiza la pantalla para la gestión del OTP.
 */
const Register = () => {
    // Obtiene parámetros de la URL
    const searchParams = useSearchParams();
    const email = searchParams.get('email') as string;
    const [loading, setLoading] = useState(false);

    // Hook para navegación programática
    const router = useRouter();

    // Reglas de validación para el campo email
    const { requiredEmail, patternEmail } = formValidate();

    // Hook para manejar formularios
    const {
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>();

    /**
     * Evento de envío del formulario.
     * Valida el email, solicita el token y redirige según resultado.
     * @param data - Datos del formulario
     */
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const validateEmail = await fetchValidateRegisterEmail(data.email);
            if (!validateEmail) {
                const result = await fetchTokenApi(data.email);
                console.log(result);
                if (result) {
                    return router.push(
                        `/register/opt?email=${encodeURIComponent(result.email)}&uuid=${encodeURIComponent(result.uuid)}`
                    );
                }
            } else {
                return router.push(
                    `/login?email=${encodeURIComponent(data.email)}`
                );
            }
        } catch (error: unknown) {
            // Captura y muestra el error en el campo email
            const errorMessage = error as string;
            setError('email', { message: errorMessage || 'Error unknown...' });
        } finally {
            setLoading(false);
        }
    });

    /**
     * Navegación hace atrás-
     * @returns
     */
    const handleOnBack = () => {
        if (email) {
            return router.push(`/login?email=${email}`);
        }
        return router.push('/login');
    };
    return (
        <>
            <CenteredHeaderWithBack
                onBack={handleOnBack}
                icon={
                    <ArrowBackIcon className="mb-2 inline cursor-pointer text-cyan-600 hover:text-cyan-900" />
                }
            >
                {/* Renderiza encabezado según si viene de login o no */}
                {!email && <Title title={AuthMessages.register.title} />}
                {email && (
                    <>
                        <Title title={AuthMessages.register.subtitle} />
                    </>
                )}
            </CenteredHeaderWithBack>
            <HeaderText text={AuthMessages.register.welcome} />

            {/* Formulario de ingreso de correo */}
            <div className="grid justify-items-center px-2">
                <form onSubmit={onSubmit}>
                    <FormInput
                        type="root"
                        label={AuthMessages.inputs.email}
                        placeholder={Messages.placeholder.emailExample}
                        {...register('email', {
                            required: requiredEmail,
                            pattern: patternEmail,
                            value: email && email,
                        })}
                        isError={Boolean(errors.email || errors.root)}
                    >
                        <FormError error={errors.email?.message ?? ''} />
                    </FormInput>

                    <LoadButton
                        loading={loading}
                        textButton={AuthMessages.buttons.registerWithEmail}
                    />
                </form>
            </div>
        </>
    );
};

export default Register;
