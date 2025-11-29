'use client';

import OtpInput from 'react-otp-input';
import Link from 'next/link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormError from '@app/shared/ui/FormError';

import {
    fetchValidateTokenApi,
    fetchTokenApi,
    ClientError,
    isClientErrorMessage,
} from '@app/helpers/fetch-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthErrors } from '@auth/constants/auth-errors';
import { AuthMessages } from '@auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';
import OpenMailbox from '@auth/components/OpenMailbox';
import { LineLoader } from '@user/components/profile/ProfileItemHeader';

import { UserMessages } from '@user/constants/user-messages';
import Text from '@user/ui/user-feed/Text';
import HeaderAction from '@auth/components/HeaderAction';
import AnimatedPage from '@auth/components/AnimatedPage';
import AlertInfo from '@app/shared/components/AlertInfo';

/**
 * Estilos CSS inline para el código OPT.
 */
const styleOpt = {
    width: '2.3rem',
    height: '2.3rem',
};

/**
 * Página de ingreso de código OTP para la validación del usuario en el proceso de registro.
 * El código se verifica automáticamente al ingresar 6 dígitos.
 * También permite reenviar el código al correo del usuario.
 */
const Opt = () => {
    const [otp, setOtp] = useState('');
    const [errorBack, setErrorBack] = useState('');
    const [successResend, setSuccessResend] = useState(false);
    const [codeError, setCodeError] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email') as string;
    const uuid = searchParams.get('uuid') as string;
    const [loading, setLoading] = useState(false);

    /**
     * Valida el código OTP cuando el usuario completa los 6 dígitos.
     * Redirige a la página de establecer contraseña si el código es válido.
     * Muestra errores en caso de fallo.
     */
    const handleChange = async (code: string) => {
        setOtp(code);
        setLoading(true);
        try {
            if (code.length === 6) {
                setErrorBack('');
                const res = await fetchValidateTokenApi(code, email, uuid);

                if (res) {
                    router.push(
                        `/register/set-password?email=${encodeURIComponent(email)}&uuid=${encodeURIComponent(uuid)}`
                    );
                }
            }
        } catch (error: unknown) {
            if (error instanceof ClientError) {
                console.log(error.code, error.message);
                if (error.code === AuthErrors.funciontal.login.emailNotMatch) {
                    setCodeError(error.code);
                }
                setErrorBack(error.message);
            } else {
                setErrorBack(String(error));
            }
        } finally {
            setLoading(false);
            console.log(codeError, errorBack);
        }
    };

    /**
     * Reenvía un nuevo código OTP al correo del usuario.
     * Reinicia estados de error y código anterior.
     */
    const handleClick = async () => {
        setOtp('');
        setErrorBack('');

        try {
            const result = await fetchTokenApi(email);
            const { uuid } = result;
            if (result) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('uuid', uuid);
                router.replace(`?${params.toString()}`);

                setSuccessResend(true);
            }
        } catch (error: unknown) {
            if (isClientErrorMessage(error)) {
                setErrorBack(error.message);
            }
            setErrorBack(String(error));
        }
    };

    /**
     * Navegación hace atrás-
     * @returns
     */
    const handleOnBack = () => {
        if (email) {
            return router.push(`/register?email=${email}`);
        }
        return router.push('/login');
    };

    /**
     * Renderizado del componente OTP, instrucciones, inputs de código,
     * mensajes de error, enlaces para reenviar código y acceso rápido a clientes de correo.
     */
    return (
        <AnimatedPage>
            <div className="mx-auto w-full max-w-[250px] place-items-center py-5 sm:max-w-[500px]">
                {/* Titulo y contenido*/}
                <HeaderAction
                    title={
                        <>
                            {AuthMessages.otp.title}
                            {loading && (
                                <div className="pt-2">
                                    <LineLoader />
                                </div>
                            )}
                        </>
                    }
                    onAction={handleOnBack}
                    tooltipText={UserMessages.messageToolTip.back}
                    icon={
                        <ArrowBackIcon
                            sx={{ fontSize: '0.9rem' }}
                            className="inline cursor-pointer text-[0.01rem] text-black"
                        />
                    }
                />
                {/* isSuccessResend isSuccessResend */}
                {successResend && (
                    <AlertInfo duration={5}>
                        <Text
                            sizeOffset={15}
                            text={AuthMessages.otp.codeResentSuccess}
                            className="my-3 rounded-lg bg-[#EBF9F0] p-1 text-center text-emerald-700"
                        />
                    </AlertInfo>
                )}
                <Text
                    sizeOffset={23}
                    className="text-center"
                    text={
                        <div className="my-5 overflow-hidden px-6 font-[350] text-gray-500">
                            {AuthMessages.otp.subtitleSendEmail}
                            <label className="text-[#5280DA]">{email}</label>
                            {AuthMessages.otp.subtitleEnterCode}
                        </div>
                    }
                />

                {/* Formulario - Código OPT */}
                <div className="grid items-center justify-items-center text-[#5280DA]">
                    <OtpInput
                        value={otp}
                        onChange={handleChange}
                        numInputs={6}
                        inputStyle={styleOpt}
                        renderInput={(props, index) => (
                            <input
                                {...props}
                                className={`mx-2 rounded-lg border-[0.1rem] text-center text-xl transition-all duration-200 ease-in-out focus:outline-none ${
                                    errorBack
                                        ? // Estilos cuando hay error
                                          'border-[#E1564C] bg-red-50 text-sm text-[#E1564C] placeholder-[#E1564C] focus:border-[#E1564C] focus:ring-1 focus:ring-[#F6A5A0]'
                                        : // Estilos normales (azul)
                                          'border-[#5280DA] focus:border-[#5280DA] focus:ring-1 focus:ring-[#93B4F6]'
                                }`}
                            />
                        )}
                    />
                    {errorBack && !codeError && (
                        <div className="mt-2 grid justify-items-center text-center">
                            <FormError error={errorBack} isLimitWidth={false} />

                            <button
                                onClick={() => {
                                    setOtp('');
                                    setErrorBack('');
                                }}
                            >
                                <Text
                                    text="Limpiar y reintentar"
                                    sizeOffset={0}
                                    className="py-1/3 w-fit cursor-pointer rounded-lg bg-red-100 px-2 font-[450] text-red-700 hover:underline"
                                />
                            </button>
                        </div>
                    )}

                    {/* Error: cuando el código ingresado existe, pero el correo no coincide. */}
                    {codeError && (
                        <div className="mt-2 text-center">
                            <FormError
                                error={
                                    <>
                                        {
                                            Messages.commons.literalTexts
                                                .confirmReturn
                                        }
                                        <Link
                                            href="/register"
                                            className="font-medium hover:underline"
                                        >
                                            {
                                                Messages.commons.literalTexts
                                                    .register
                                            }
                                        </Link>
                                    </>
                                }
                            />
                        </div>
                    )}

                    <div className="my-5 text-center">
                        <Text
                            text={
                                <div className="px-6 leading-normal font-[350] text-gray-500">
                                    {AuthMessages.otp.emailNotFound}
                                    {AuthMessages.otp.checkSpamOrClick}
                                    <button
                                        className="cursor-pointer text-[#5280DA] hover:underline"
                                        onClick={handleClick}
                                    >
                                        {Messages.commons.literalTexts.here}
                                    </button>
                                    {AuthMessages.otp.resendCodeLink}
                                </div>
                            }
                            className="py-1"
                            sizeOffset={12}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <OpenMailbox typeStyle="loginOpt" className="flex w-auto" />
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Opt;
