'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import {
    fetchValidateRegisterEmail,
    fetchTokenCrsfApi,
    isClientErrorMessage,
} from '@app/helpers/fetch-api';
import { LoginForm } from '@app/shared/interfaces/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthMessages } from '@auth/constants/auth-messages';
import { AuthErrors } from '@auth/constants/auth-errors';
import { Messages } from '@app/shared/constants/messages';
import { loginApi } from '@auth/utils/authUtils';
import { useUserContext } from '@user/utils/UseUserContext';
import { UserMessages } from '@user/constants/user-messages';

import FormError from '@app/shared/ui/FormError';
import Paragraph from '@app/shared/ui/Paragraph';
import HomeIcon from '@mui/icons-material/Home';
import LoadButton from '@auth/components/LoadButton';
import Text from '@user/ui/user-feed/Text';
import InputText from '@user/ui/inputs/InputText';
import HeaderAction from '@auth/components/HeaderAction';
import AnimatedPage from '@auth/components/AnimatedPage';
import AlertInfo from '@app/shared/components/AlertInfo';

/**
 * Página login: esta vista presenta un formulario de autenticación para que el usuario ingrese
 * su correo electrónico y contraseña. Valida los datos, muestra errores en caso de
 * fallos y redirige al usuario tras un login exitoso. También puede precargar el
 * email si se recibe como parámetro en la URL.
 */
const Login = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [emailParam, setEmailParam] = useState('');
    const { requiredEmail, requiredPassword, patternEmail, minLength } =
        formValidate();
    const [registeredUser, setRegisteredUser] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [suppressBlurValidation, setSuppressBlurValidation] = useState(false);

    const {
        getValues,
        trigger,
        register,
        handleSubmit,
        setError,
        setValue,
        setFocus,
        formState: { errors },
    } = useForm<LoginForm>({ mode: 'all' });
    const { userDTO } = useUserContext();
    const [countdown, setCountdown] = useState(3);
    const [notExistUser, setNotExistUser] = useState(false);

    /**
     * Prellena el campo de email si se recibe como parámetro en la URL (?email=).
     * Ejecutado en el primer render y al cambiar los searchParams.
     */
    useEffect(() => {
        if (userDTO) {
            router.push('/user');
            return;
        }

        const email = getValues('email');
        const emailFromParam = searchParams.get('email');

        // Solo actualiza la URL si el email del form y el de la URL son distintos
        if (email && email !== emailFromParam) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('email', email);
            router.replace(`?${params.toString()}`);
        }

        // Solo actualiza el estado si el parámetro cambió
        if (emailFromParam && emailFromParam !== emailParam) {
            setEmailParam(emailFromParam);
            setValue('email', emailFromParam);
        }
    }, [userDTO]);

    /**
     * Configuración de validación para el campo de email.
     */
    const passwordRegister = register('password', {
        required: requiredPassword,
        minLength,
    });

    /**
     * Configuración de validación para el campo de contraseña.
     */
    const usernameRegister = register('email', {
        required: requiredEmail,
        pattern: patternEmail,
    });

    /**
     * Inicia una cuenta regresiva para redirigir al registro
     * después de unos segundos, mostrando un mensaje temporal.
     */
    const startRedirectCountdown = (
        email: string,
        setCountdown: (value: number) => void,
        setNotExistUser: (value: boolean) => void,
        setBtnLoading: (value: boolean) => void,
        router: ReturnType<typeof useRouter>,
        seconds: number = 3
    ) => {
        setNotExistUser(true);
        setCountdown(seconds);

        const interval = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);

            if (seconds <= 0) {
                clearInterval(interval);
                setNotExistUser(false);
                setBtnLoading(false);
                router.push(`/register?email=${email}`);
            }
        }, 1000);
    };

    /** Al perder el foco del campo email, valida si el correo está registrado
     * para habilitar la opción de recuperación de contraseña.
     */
    const handleEmailBlur = async () => {
        if (suppressBlurValidation) {
            return;
        }
        const isValid = await trigger('email');
        const emailOnBlur = getValues('email');

        if (isValid) {
            try {
                // Validación si el email ya esta registrado
                const res = await fetchValidateRegisterEmail(emailOnBlur);
                setBtnLoading(true);
                if (res) {
                    setEmailParam(emailOnBlur);
                    setRegisteredUser(res);
                    setBtnLoading(false);
                } else {
                    startRedirectCountdown(
                        emailOnBlur,
                        setCountdown,
                        setNotExistUser,
                        setBtnLoading,
                        router
                    );
                }
            } catch {}
        }
    };

    /**
     Envía las credenciales al backend para iniciar sesión.
     Redirige a registro si el usuario no existe o muestra errores según el código.
     */
    const onSubmit = handleSubmit(
        async (data) => {
            console.log('entro.1..', data);
            setBtnLoading(true);
            try {
                // Paso 1:  cookie httpOnly para CSRF token
                await fetchTokenCrsfApi(data.email);
                // Paso 2:  cookie httpOnly para jwt token
                await loginApi(data.email, data.password);
                // Pausa para mejorar la interacción con el usuario
                // await new Promise((resolve) => setTimeout(resolve, 500));
                router.push('/user');
            } catch (error: unknown) {
                setBtnLoading(false);
                if (isClientErrorMessage(error)) {
                    switch (error.code) {
                        case AuthErrors.funciontal.login.notFoundUsername:
                            startRedirectCountdown(
                                data.email,
                                setCountdown,
                                setNotExistUser,
                                setBtnLoading,
                                router
                            );
                            return;
                        case AuthErrors.funciontal.login.badCredentials:
                            setError('password', { message: error.message });
                            setFocus('password');
                            return;
                        default:
                            return setError('root', {
                                message: error.message,
                            });
                    }
                }
            }
        },
        (clientErrors) => {
            if (clientErrors.email) {
                setFocus('email');
            } else if (clientErrors.password) {
                setFocus('password');
            }
        }
    );

    /**
     * Componente React con el formulario de login.
     *
     */
    return (
        <AnimatedPage>
            <div className="mx-auto w-full max-w-[250px] place-items-center py-5 select-none sm:max-w-[420px]">
                <HeaderAction
                    title={AuthMessages.login.title}
                    message={AuthMessages.login.subtitle}
                    onAction={() => router.push('/')}
                    tooltipText={UserMessages.messageToolTip.start}
                    icon={
                        <HomeIcon
                            sx={{ fontSize: '0.9rem' }}
                            className="inline cursor-pointer text-[0.01rem] text-black"
                        />
                    }
                />

                <div className="grid justify-items-center text-gray-500 sm:max-w-[420px]">
                    <form onSubmit={onSubmit}>
                        {/* Notificación */}
                        {notExistUser && (
                            <AlertInfo duration={5}>
                                <Text
                                    sizeOffset={15}
                                    text={
                                        <>
                                            {AuthMessages.otp.emailNotExist}
                                            <p className="">
                                                {`Redirigiendo al registro en `}
                                                <label className="font-[500]">{`${countdown} s...`}</label>
                                            </p>
                                        </>
                                    }
                                    className="my-3 w-full rounded-lg bg-[#EBF9F0] p-1 text-center text-emerald-800"
                                />
                            </AlertInfo>
                        )}
                        <InputText
                            text={AuthMessages.inputs.email}
                            sizeText={5}
                            sizeTextInput={0}
                            inputClass="h-full w-full rounded-lg px-6 py-2 border-[0.14rem] focus:outline-none"
                            fullWidth={true}
                            placeholder={Messages.placeholder.emailExample}
                            {...usernameRegister}
                            onBlur={async (e) => {
                                usernameRegister.onBlur(e);
                                handleEmailBlur();
                            }}
                            isError={Boolean(errors.email || errors.root)}
                        >
                            <FormError error={errors.email?.message ?? ''} />
                        </InputText>

                        <InputText
                            type="password"
                            text={AuthMessages.inputs.password}
                            sizeText={5}
                            sizeTextInput={0}
                            inputClass="h-full w-full rounded-lg border px-6 py-2  border-[0.14rem] focus:outline-none"
                            fullWidth={true}
                            placeholder={Messages.placeholder.password}
                            {...passwordRegister}
                            onChange={async (e) => {
                                passwordRegister.onChange(e);
                                await trigger('password');
                            }}
                            isError={Boolean(errors.password || errors.root)}
                        >
                            <FormError error={errors.password?.message ?? ''} />
                            <div className="mt-5 text-center">
                                <Paragraph
                                    text={
                                        <Text
                                            text={
                                                <>
                                                    {
                                                        AuthMessages
                                                            .forgotPassword
                                                            .linkText
                                                    }
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/login/forgot-password?email=${emailParam}`
                                                            )
                                                        }
                                                        onMouseDown={() =>
                                                            setSuppressBlurValidation(
                                                                true
                                                            )
                                                        }
                                                        onMouseUp={() =>
                                                            setSuppressBlurValidation(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            text={
                                                                Messages.commons
                                                                    .literalTexts
                                                                    .here
                                                            }
                                                            className="mb-2 inline cursor-pointer font-[400] text-[#5280DA] hover:underline"
                                                        />
                                                    </button>
                                                </>
                                            }
                                            className="font-[400]"
                                        />
                                    }
                                />
                            </div>
                        </InputText>

                        <LoadButton
                            loading={btnLoading}
                            isError={Boolean(
                                errors.email || errors.root || errors.password
                            )}
                            textButton={
                                notExistUser
                                    ? 'Registrate'
                                    : AuthMessages.buttons.login
                            }
                        />
                        {/* {existEmail == null && emailParam == null && ( */}
                        {(!registeredUser || !emailParam) && (
                            <div className="mt-7 text-center">
                                <Paragraph
                                    text={
                                        <Text
                                            text={
                                                <>
                                                    {
                                                        AuthMessages.register
                                                            .promptText
                                                    }
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (emailParam) {
                                                                router.push(
                                                                    `/register?email=${emailParam}`
                                                                );
                                                            } else {
                                                                router.push(
                                                                    '/register'
                                                                );
                                                            }
                                                        }}
                                                        // antes del blur
                                                        onMouseDown={() =>
                                                            setSuppressBlurValidation(
                                                                true
                                                            )
                                                        }
                                                        // restablece después
                                                        onMouseUp={() =>
                                                            setSuppressBlurValidation(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        <Text
                                                            text={
                                                                AuthMessages
                                                                    .register
                                                                    .linkText
                                                            }
                                                            className="mb-2 inline cursor-pointer font-[400] text-[#5280DA] hover:underline"
                                                        />
                                                    </button>
                                                </>
                                            }
                                            className="font-[400] text-gray-500"
                                        />
                                    }
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Login;
