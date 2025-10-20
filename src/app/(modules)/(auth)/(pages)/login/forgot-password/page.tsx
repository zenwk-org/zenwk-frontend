'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ClientErrorMessage } from '@app/shared/interfaces/auth';
import { useState } from 'react';
import { AuthMessages } from '@auth/constants/auth-messages';
import { Messages } from '@app/shared/constants/messages';
import { CommonsErros } from '@app/shared/constants/commons-erros';
import {
    fetchValidateRegisterEmail,
    getUrlServer,
    fetchVerifcation,
} from '@app/helpers/fetch-api';

import FormInput from '@app/app/(modules)/(auth)/ui/FormInput';
import HeaderText from '@app/app/(modules)/(auth)/ui/HeaderText';
import Title from '@app/app/(modules)/(auth)/ui/Title';
import FormError from '@app/shared/ui/FormError';
import Label from '@app/app/(modules)/(auth)/ui/Label';
import Link from 'next/link';
import LabelLink from '@app/app/(modules)/(auth)/ui/LabelLink';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredHeaderWithBack from '@auth/components/CenteredHeaderWithBack';
import GeneralPageInfo from '@app/shared/ui/GeneralPageInfo';
import LoadButton from '@auth/components/LoadButton';
import Spinner from '@app/shared/ui/Spinner';

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
    const [isRegistered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSendEmail, setSendEmail] = useState(false);
    const [isBtnLoading, setBtnLoading] = useState(false);
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
                    throw {
                        code: CommonsErros.unknownCode,
                        message: CommonsErros.unknown(
                            'ForgotPassword.handleSubmit(...))'
                        ),
                    };
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
        <>
            {!isSendEmail ? (
                <>
                    {/** Formulario de email */}
                    <CenteredHeaderWithBack
                        onBack={handleOnBack}
                        icon={
                            <ArrowBackIcon className="mb-2 inline cursor-pointer text-cyan-600 hover:text-cyan-900" />
                        }
                    >
                        <Title title={AuthMessages.forgotPassword.title} />
                    </CenteredHeaderWithBack>
                    <HeaderText text={AuthMessages.forgotPassword.subtitle} />

                    <div className="grid justify-center">
                        <form onSubmit={onSubmit}>
                            <FormInput
                                type="root"
                                label={AuthMessages.inputs.email}
                                placeholder={Messages.placeholder.emailExample}
                                {...registerEmail}
                                onChange={() => {
                                    if (!isRegistered) {
                                        setRegistered(true);
                                    }
                                }}
                                isError={Boolean(errors.email)}
                            >
                                <FormError
                                    error={errors.email?.message || ''}
                                />
                            </FormInput>
                            {!isRegistered && (
                                <Label
                                    text={
                                        <div className="text-center">
                                            {AuthMessages.register.promptText}
                                            <Link
                                                href={`/register?email=${email}`}
                                            >
                                                <LabelLink
                                                    text={
                                                        AuthMessages.register
                                                            .linkText
                                                    }
                                                />
                                            </Link>
                                        </div>
                                    }
                                />
                            )}
                            <LoadButton
                                textButton={AuthMessages.buttons.forgotPassword}
                                loading={isBtnLoading}
                            />
                        </form>
                    </div>
                </>
            ) : (
                <div className="">
                    {/** SimulaciónPGA cuando el email se envía con éxito.*/}
                    <GeneralPageInfo
                        title={AuthMessages.forgotPassword.sendEmail.title}
                        helloText={AuthMessages.forgotPassword.sendEmail.hello}
                        infoText={AuthMessages.commons.sendEmail.successText}
                        keyWord={email}
                        onBack={() => setSendEmail(false)}
                        icon={
                            <ArrowBackIcon className="mb-2 inline cursor-pointer text-cyan-600 hover:text-cyan-900" />
                        }
                    />
                </div>
            )}
        </>
    );
};

export default ForgotPassword;
