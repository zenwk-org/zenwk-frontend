'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import {
    fetchTokenApi,
    fetchValidateRegisterEmail,
} from '@app/lib/shared/utils/fetchApi';
import { AuthMessages } from '@app/lib/modules/auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';
import { UserMessages } from '@app/lib/modules/user/constants/user-messages';

import FormError from '@app/shared/ui/FormError';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadButton from '@app/components/modules/auth/commons/LoadButton';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import InputText from '@app/components/ui/inputs/InputText';
import HeaderAction from '@app/components/modules/auth/commons/HeaderAction';
import AnimatedPage from '@app/components/modules/auth/commons/AnimatedPage';
import AlertInfo from '@app/shared/components/AlertInfo';
import HomeIcon from '@mui/icons-material/Home';

/**
 * Registro del usuario, renderiza la pantalla para la gestión del OTP.
 */
const RegisterForm = () => {
    // Obtiene parámetros de la URL
    const searchParams = useSearchParams();
    const email = searchParams.get('email') as string;
    const [loading, setLoading] = useState(false);
    const [existUser, setExistUser] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const isFromHome = Boolean(searchParams.get('fromHome') as string);

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
    } = useForm<{ email: string }>({ mode: 'all' });

    /**
     * Evento de envío del formulario.
     * Valida el email, solicita el token y redirige según resultado.
     * @param data - Datos del formulario
     */
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const validateEmail = await fetchValidateRegisterEmail(data.email);
            if (validateEmail === false) {
                const result = await fetchTokenApi(data.email);
                if (result) {
                    setLoading(false);
                    return router.push(
                        `/register/opt?email=${encodeURIComponent(result.email)}&uuid=${encodeURIComponent(result.uuid)}`
                    );
                }
            } else {
                setExistUser(true);
                let seconds = 3;
                setCountdown(seconds);

                const interval = setInterval(() => {
                    seconds -= 1;
                    setCountdown(seconds);

                    if (seconds <= 0) {
                        clearInterval(interval);
                        // Redirige al inicio de sesión
                        setExistUser(false);
                        setLoading(false);
                        router.push(
                            `/login?email=${encodeURIComponent(data.email)}`
                        );
                    }
                }, 1000);
            }
        } catch (error: unknown) {
            // Captura y muestra el error en el campo email
            const errorMessage = error as string;
            setError('email', { message: errorMessage || 'Error unknown...' });
        }
    });

    /**
     * Navegación hace atrás-
     * @returns
     */
    const handleOnBack = () => {
        if (isFromHome) {
            return router.push(`/`);
        }
        if (email) {
            return router.push(`/login?email=${email}`);
        }
        return router.push('/login');
    };
    return (
        <AnimatedPage>
            <div className="mx-auto w-full max-w-[250px] place-items-center py-5 select-none sm:max-w-[420px]">
                <HeaderAction
                    title={
                        email == null
                            ? AuthMessages.register.title
                            : AuthMessages.register.subtitle
                    }
                    message={AuthMessages.register.welcome}
                    onAction={handleOnBack}
                    tooltipText={UserMessages.messageToolTip.back}
                    icon={
                        isFromHome ? (
                            <HomeIcon
                                sx={{ fontSize: '0.9rem' }}
                                className="inline cursor-pointer text-[0.01rem] text-black"
                            />
                        ) : (
                            <ArrowBackIcon
                                sx={{ fontSize: '0.9rem' }}
                                className="inline cursor-pointer text-[0.01rem] text-black"
                            />
                        )
                    }
                />
                {/* Notificación */}
                {existUser && (
                    <AlertInfo duration={5}>
                        <Text
                            sizeOffset={15}
                            text={
                                <>
                                    {AuthMessages.otp.emailExist}
                                    <p className="">
                                        {`Te redirigiremos al inicio de sesión en `}
                                        <label className="font-[500]">{`${countdown} s...`}</label>
                                    </p>
                                </>
                            }
                            className="my-3 rounded-lg bg-[#EBF9F0] p-1 text-center text-emerald-800"
                        />
                    </AlertInfo>
                )}
                {/* Formulario de ingreso de correo */}
                <div className="grid justify-items-center text-gray-500 sm:max-w-[420px]">
                    <form onSubmit={onSubmit}>
                        <InputText
                            type="root"
                            text={AuthMessages.inputs.email}
                            sizeText={5}
                            sizeTextInput={0}
                            inputClass="h-full w-full rounded-lg px-6 py-2 border-[0.14rem] focus:outline-none"
                            fullWidth={true}
                            placeholder={Messages.placeholder.emailExample}
                            {...register('email', {
                                required: requiredEmail,
                                pattern: patternEmail,
                                value: email || '',
                            })}
                            isError={Boolean(errors.email || errors.root)}
                        >
                            <FormError error={errors.email?.message ?? ''} />
                        </InputText>

                        <LoadButton
                            isError={Boolean(errors.email || errors.root)}
                            loading={loading}
                            textButton={
                                existUser
                                    ? 'Redirigiendo a inicio de sesión'
                                    : AuthMessages.buttons.registerWithEmail
                            }
                        />
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default RegisterForm;
