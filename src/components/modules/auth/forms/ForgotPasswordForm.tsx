'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthMessages } from '@app/lib/modules/auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';
import { CommonsErros } from '@app/shared/constants/commons-erros';
import {
    fetchValidateRegisterEmail,
    getUrlServer,
    fetchVerifcation,
    isClientErrorMessage,
} from '@app/lib/shared/utils/fetchApi';
import { UserMessages } from '@app/lib/modules/user/constants/user-messages';

import FormError from '@app/shared/ui/FormError';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GeneralPageInfo from '@app/shared/ui/GeneralPageInfo';
import LoadButton from '@app/components/modules/auth/commons/LoadButton';
import Spinner from '@app/shared/ui/Spinner';

import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import InputText from '@app/components/ui/inputs/InputText';
import HeaderAction from '@app/components/modules/auth/commons/HeaderAction';
import AnimatedPage from '@app/components/modules/auth/commons/AnimatedPage';
import AlertInfo from '@app/shared/components/AlertInfo';

/**
 * Sonar. Manejo de error custom
 */
export class AppError extends Error {
    code: string;

    constructor(code: string, message: string) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Página ForgotPassword: permite ingresar el email para recuperar contraseña.
 */
const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        setError,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<{ email: string }>({ mode: 'all' });

    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const { patternEmail, requiredEmail } = formValidate();
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendEmail, setSendEmail] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);
    const [existUser, setExistUser] = useState(false);

    useEffect(() => {
        const paramEmail = searchParams.get('email') as string;
        setValue('email', paramEmail || email);
        setEmail(getValues('email'));

        if (paramEmail) {
            setRegistered(true);
        }
        setLoading(false);
    }, [setEmail]);

    /**
     * Cargador ...
     */
    if (loading) {
        return (
            <div data-testid="loading-spinner">
                <Spinner />
            </div>
        );
    }

    /**
     * Maneja el envío del formulario.
     * Valida si el email está registrado y envía el código de verificación.
     */
    const onSubmit = handleSubmit(async (data) => {
        setBtnLoading(true);
        try {
            const email = data.email;
            const res = await fetchValidateRegisterEmail(email);
            setEmail(email);

            if (res) {
                const path = '/verification/token/reset-password';
                const param = {
                    email,
                    pathUrl: getUrlServer() + '/login/reset-password',
                };
                const resResetPassword = await fetchVerifcation(
                    path,
                    undefined,
                    param,
                    'POST'
                );

                if (resResetPassword) {
                    return setSendEmail(true);
                } else {
                    throw new AppError(
                        CommonsErros.unknownCode,
                        CommonsErros.unknown('ForgotPassword.handleSubmit(...)')
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
                            `/register?email=${encodeURIComponent(data.email)}`
                        );
                    }
                }, 1000);

                setRegistered(false);
                setSendEmail(false);
            }
        } catch (error) {
            if (isClientErrorMessage(error)) {
                setError('email', { message: error.message });
            }
        } finally {
            setLoading(false);
            setBtnLoading(false);
        }
    });

    const registerEmail = register('email', {
        required: requiredEmail,
        pattern: patternEmail,
    });

    /**
     * Navegación hace atrás-
     * @returns
     */
    const handleOnBack = () => {
        return router.push(`/login?email=${email}`);
    };

    /**
     * Renderiza el formulario de recuperación de contraseña.
     */
    return (
        <AnimatedPage>
            {/*  */}
            <>
                {/* Notificación */}
                {existUser && (
                    <AlertInfo duration={5}>
                        <Text
                            sizeOffset={15}
                            text={
                                <>
                                    {AuthMessages.otp.emailNotExist}
                                    <p className="">
                                        {`Te redirigiremos a la pagina de registro en `}
                                        <label className="font-[500]">{`${countdown} s...`}</label>
                                    </p>
                                </>
                            }
                            className="my-3 rounded-lg bg-[#EBF9F0] p-1 text-center text-emerald-800"
                        />
                    </AlertInfo>
                )}
                {sendEmail === false ? (
                    <div className="mx-auto w-full max-w-[250px] place-items-center py-5 sm:max-w-[420px]">
                        <HeaderAction
                            title={AuthMessages.forgotPassword.title}
                            message={AuthMessages.forgotPassword.subtitle}
                            onAction={handleOnBack}
                            tooltipText={UserMessages.messageToolTip.back}
                            icon={
                                <ArrowBackIcon
                                    sx={{ fontSize: '0.9rem' }}
                                    className="inline cursor-pointer text-[0.01rem] text-black"
                                />
                            }
                        />
                        {/** Formulario de email */}
                        <div className="grid justify-items-center text-gray-500 sm:max-w-[420px]">
                            <form onSubmit={onSubmit}>
                                <InputText
                                    type="root"
                                    sizeText={5}
                                    sizeTextInput={0}
                                    fullWidth={true}
                                    inputClass="h-full w-full rounded-lg px-6 py-2 border-[0.14rem] focus:outline-none"
                                    text={AuthMessages.inputs.email}
                                    placeholder={
                                        Messages.placeholder.emailExample
                                    }
                                    {...registerEmail}
                                    isError={Boolean(
                                        errors.email || errors.root
                                    )}
                                >
                                    <FormError
                                        error={errors.email?.message || ''}
                                    />
                                </InputText>

                                <LoadButton
                                    isError={Boolean(
                                        errors.email || errors.root
                                    )}
                                    textButton={
                                        AuthMessages.buttons.forgotPassword
                                    }
                                    loading={btnLoading}
                                />

                                {!registered && (
                                    <Text
                                        className="mt-7 font-[400] text-black"
                                        text={
                                            <div className="text-center">
                                                {
                                                    AuthMessages.register
                                                        .promptText
                                                }
                                                <Link
                                                    href={`/register?email=${email}`}
                                                >
                                                    <label className="inline cursor-pointer font-[400] text-[#5280DA] hover:underline">
                                                        {
                                                            AuthMessages
                                                                .register
                                                                .linkText
                                                        }
                                                    </label>
                                                </Link>
                                            </div>
                                        }
                                    />
                                )}
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        {/** SimulaciónPGA cuando el email se envía con éxito.*/}
                        <GeneralPageInfo
                            title={AuthMessages.forgotPassword.sendEmail.title}
                            helloText={
                                AuthMessages.forgotPassword.sendEmail.hello
                            }
                            infoText={
                                <>
                                    <label className="">
                                        {
                                            AuthMessages.commons.sendEmail
                                                .successText
                                        }
                                    </label>
                                    <Text
                                        className="py-5 text-center font-[400] text-gray-900"
                                        text={
                                            AuthMessages.commons.sendEmail
                                                .openInbox
                                        }
                                        sizeOffset={15}
                                    />
                                </>
                            }
                            keyWord={email}
                            onBack={() => setSendEmail(false)}
                            icon={
                                <ArrowBackIcon
                                    sx={{ fontSize: '1rem' }}
                                    className="inline cursor-pointer text-[0.01rem] text-black"
                                />
                            }
                        />
                    </div>
                )}
            </>
        </AnimatedPage>
    );
};

export default ForgotPasswordForm;
