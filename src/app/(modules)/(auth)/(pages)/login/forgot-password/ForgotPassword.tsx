'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientErrorMessage } from '@app/shared/interfaces/auth';
import { AuthMessages } from '@auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';
import { CommonsErros } from '@app/shared/constants/commons-erros';
import {
    fetchValidateRegisterEmail,
    getUrlServer,
    fetchVerifcation,
} from '@app/helpers/fetch-api';
import { UserMessages } from '@user/constants/user-messages';

import FormError from '@app/shared/ui/FormError';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GeneralPageInfo from '@app/shared/ui/GeneralPageInfo';
import LoadButton from '@auth/components/LoadButton';
import Spinner from '@app/shared/ui/Spinner';

import Text from '@user/ui/user-feed/Text';
import InputText from '@user/ui/inputs/InputText';
import HeaderAction from '@auth/components/HeaderAction';
import AnimatedPage from '@auth/components/AnimatedPage';

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
const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        setError,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<{ email: string }>();

    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const { patternEmail, requiredEmail } = formValidate();
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sendEmail, setSendEmail] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const router = useRouter();

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
        return <Spinner />;
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
                setRegistered(false);
                setSendEmail(false);
            }
        } catch (error) {
            const errorApi = error as ClientErrorMessage;
            setError('email', { message: errorApi.message });
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
                {!sendEmail ? (
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
                                    onChange={() => {
                                        if (!registered) {
                                            setRegistered(true);
                                        }
                                    }}
                                    isError={Boolean(errors.email)}
                                >
                                    <FormError
                                        error={errors.email?.message || ''}
                                    />
                                </InputText>

                                <LoadButton
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

export default ForgotPassword;
