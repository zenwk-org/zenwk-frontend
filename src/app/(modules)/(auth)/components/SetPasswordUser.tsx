'use client';

import { useForm, useWatch } from 'react-hook-form';
import { SetPassword } from '@app/shared/interfaces/auth';
import { formValidate } from '@app/shared/utils/formValidate';
import { AuthMessages } from '@auth/constants/auth-messages';
import { useRouter, useSearchParams } from 'next/navigation';
import { isClientErrorMessage } from '@app/helpers/fetch-api';
import React, { useEffect, useState } from 'react';

import FormError from '@app/shared/ui/FormError';
import InputDisabled from '@app/app/(modules)/(auth)/ui/InputDisabled';
import useRedirectRegister from '@auth/hooks/useRedirectRegister';
import LoadButton from '@auth/components/LoadButton';
import Spinner from '@app/shared/ui/Spinner';
import InputText from '@user/ui/inputs/InputText';
import Text from '@user/ui/user-feed/Text';
import AlertInfo from '@app/shared/components/AlertInfo';

import HeaderAction from './HeaderAction';

/**
 * Interface que prepsenta los valores permitidos en la desestructuración.
 */
interface Props {
    buttonText: string;
    title: string;
    headerText: string;
    isResetPassword?: boolean;
    onSubmitPassword: (
        email: string,
        password: string,
        uuid: string | '',
        tokenCode: string | ''
    ) => Promise<void>;
}

/**
 * Componente génerico con formulario para el reingreso de password.
 * @param param0
 * @returns
 */
const SetPasswordUser = React.memo(
    ({
        title,
        headerText,
        buttonText,
        onSubmitPassword,
        isResetPassword = false,
    }: Props) => {
        const searchParams = useSearchParams();
        const email = searchParams.get('email') ?? '';
        const uuid = searchParams.get('uuid') ?? '';
        const tokenCode = searchParams.get('code') ?? '';
        const [loading, setLoading] = useState(true);
        const [btnLoading, setBtnLoading] = useState(false);
        const router = useRouter();
        const [countdown, setCountdown] = useState(3);
        const [expireCode, setExpireCode] = useState(false);

        const { requiredPassword, patternPassword, validateEquals } =
            formValidate();

        const {
            setError,
            trigger,
            handleSubmit,
            register,
            getValues,
            control,
            clearErrors,
            formState: { errors },
        } = useForm<SetPassword>({ mode: 'all' });

        //  Ambos campos se escuchan en tiempo real
        const password = useWatch({ control, name: 'password' });
        const repassword = useWatch({ control, name: 'repassword' });

        /**
         * useEffect del componente.
         */
        useRedirectRegister(email, uuid, setLoading, isResetPassword);

        /**
         * UseEffect para controlar el campo repassword.
         * lógica de validación reactiva final.
         */
        useEffect(() => {
            clearErrors('root');
            if (repassword) {
                trigger('repassword');
            } else {
                clearErrors('repassword');
            }
        }, [password, repassword, trigger, clearErrors]);

        /**
         * Cargador ...
         */
        if (loading) {
            return <Spinner />;
        }

        /**
         * Procesa el formulario de set-password. Consume el API de crear usuario.
         * @oaram data
         */
        const onSubmit = handleSubmit(async (data) => {
            setBtnLoading(true);
            try {
                await onSubmitPassword(email, data.password, uuid, tokenCode);
            } catch (error) {
                if (isClientErrorMessage(error)) {
                    if (error.code == 'FUNC_SEC_USER_007') {
                        setError('password', { message: error.message });
                    } else {
                        setError('root', { message: error.message });
                        // Si el token ha espirado regresa.
                        if (error.code == 'FUNC_SEC_AUTH_0004') {
                            setExpireCode(true);
                            let seconds = 3;
                            setCountdown(seconds);

                            const interval = setInterval(() => {
                                seconds -= 1;
                                setCountdown(seconds);
                                if (seconds <= 0) {
                                    clearInterval(interval);
                                    setExpireCode(false);
                                    setLoading(false);
                                    router.push(
                                        `/forgot-password?email=${encodeURIComponent(email)}`
                                    );
                                }
                            }, 1000);
                        }
                    }
                }
            } finally {
                setBtnLoading(false);
            }
        });

        /** Componente JSX con el formulario para el reingreso de contraseña. */
        return (
            <div className="mx-auto w-full max-w-[250px] place-items-center py-5 sm:max-w-[420px]">
                <HeaderAction
                    title={title}
                    message="Verificación completada. Ingresa tu nueva contraseña."
                />

                {/* Notificación */}
                {expireCode && (
                    <AlertInfo duration={5}>
                        <Text
                            sizeOffset={15}
                            text={
                                <p className="">
                                    {`Redirigiendo a la página de recuperación de contraseña en `}
                                    <label className="font-[500]">{`${countdown} s...`}</label>
                                </p>
                            }
                            className="my-3 w-full rounded-lg bg-[#EBF9F0] p-1 text-center text-emerald-800"
                        />
                    </AlertInfo>
                )}

                <div className="grid justify-items-center text-gray-500 sm:max-w-[420px]">
                    <form onSubmit={onSubmit}>
                        {!isResetPassword && <InputDisabled text={email} />}

                        <InputText
                            sizeText={5}
                            sizeTextInput={0}
                            fullWidth={true}
                            inputClass="h-full w-full rounded-lg px-6 py-2 border-[0.14rem] focus:outline-none"
                            text={
                                isResetPassword
                                    ? AuthMessages.login.resetPassword
                                          .newPassword
                                    : AuthMessages.inputs.password
                            }
                            type="password"
                            placeholder={AuthMessages.placeholder.password}
                            {...register('password', {
                                required: requiredPassword,
                                pattern: patternPassword,
                            })}
                            isError={Boolean(errors.password || errors.root)}
                        >
                            <FormError error={errors.password?.message ?? ''} />
                        </InputText>

                        <InputText
                            sizeText={5}
                            sizeTextInput={0}
                            fullWidth={true}
                            inputClass="h-full w-full rounded-lg px-6 py-2 border-[0.14rem] focus:outline-none"
                            text={
                                isResetPassword
                                    ? AuthMessages.login.resetPassword
                                          .newRePassword
                                    : AuthMessages.inputs.repasword
                            }
                            type="password"
                            placeholder={AuthMessages.placeholder.repassword}
                            {...register('repassword', {
                                validate: validateEquals(
                                    getValues('password'),
                                    'Las contraseñas no coinciden.'
                                ),
                            })}
                            isError={Boolean(errors.repassword || errors.root)}
                        >
                            <FormError
                                error={errors.repassword?.message ?? ''}
                            />
                        </InputText>

                        {errors.root && (
                            <FormError
                                error={
                                    <Text
                                        text={errors.root.message}
                                        className="py-2 text-justify"
                                    />
                                }
                            />
                        )}

                        <LoadButton
                            loading={btnLoading}
                            isError={Boolean(
                                errors.password ||
                                    errors.root ||
                                    errors.repassword
                            )}
                            textButton={buttonText}
                            textLoading={
                                isResetPassword
                                    ? AuthMessages.buttons.redirectLogin
                                    : buttonText
                            }
                        />
                    </form>
                </div>
            </div>
        );
    }
);

export default SetPasswordUser;
