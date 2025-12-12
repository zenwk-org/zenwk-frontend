import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserDTO } from '@/lib/modules/user/types/user-dto';
import { Messages } from '@/lib/shared/constants/messages';
import { formValidate } from '@/lib/shared/utils/formValidate';
import { useForm, useWatch } from 'react-hook-form';
import { UserMessages } from '@/lib/modules/user/constants/user-messages';

import { clsx } from 'clsx';

import ProfileButtomForm from '@/components/modules/user/profile/ProfileButtonForm';
import InputText from '@/components/ui/inputs/InputText';
import FormErrorUser from '@/components/ui/forms/FormErrorUser';
import Text from '@/components/shared/common/Text';
import OpenMailbox from '@/components/modules/auth/common/OpenMailbox';
import NotificationModal from '@/components/shared/common/NotificationModal';
import AlertInfo from '@/components/shared/common/AlertInfo';

/**
 *
 * @param param0
 * @returns
 */
const UpdateEmailSection = ({
    userDTO,
    setLineLoadingFather,
}: {
    userDTO: UserDTO;
    setLineLoadingFather: Dispatch<SetStateAction<boolean>>;
}) => {
    const [emailChangeSucceeded, setEmailChangeSucceeded] = useState(false);
    const [isNewEmail, setIsNewEmail] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [lineLoading, setLineLoading] = useState(false);
    const [loadBtnUpdateEmail, setLoadBtnUpdateEmail] = useState(false);
    const { requiredEmail, patternEmail, validateEquals } = formValidate();
    const [isApprove, setIsApprove] = useState(false);

    const {
        clearErrors,
        getValues,
        setValue,
        trigger,
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isValid },
    } = useForm<{ email: string; reemail: string }>({ mode: 'all' });

    const emailValue = useWatch({ control, name: 'email' });
    const reemailValue = useWatch({ control, name: 'reemail' });

    /**
     * Evento validación de igualadad email / reemail
     */
    useEffect(() => {
        if (emailValue?.length > 0) {
            trigger('reemail');
        } else if (!emailValue) {
            clearErrors();
        }
    }, [trigger, clearErrors, emailValue]);

    /**
     * Habilitar boton actualizar cuando no hayan errores.
     */
    useEffect(() => {
        if (isValid && reemailValue?.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [isValid, reemailValue, getValues, emailValue]);

    const emailRegister = register('email', {
        required: requiredEmail,
        pattern: patternEmail,
    });

    const reemailRegister = register('reemail', {
        required: requiredEmail,
        pattern: patternEmail,
        validate: validateEquals(
            getValues('email'),
            UserMessages.profileConfiguration.sections.updateEmail
                .errorNotEquals
        ),
    });

    const onSubmit = handleSubmit(async (data) => {
        setLineLoading(true);
        setLineLoadingFather(true);
        setLoadBtnUpdateEmail(true);
        try {
            console.log(data);
        } catch (error) {
            setError('root', { message: error as string });
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 400));
            setEmailChangeSucceeded(true);
            setLineLoading(false);
            setLoadBtnUpdateEmail(false);
            setValue('email', '');
            setValue('reemail', '');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLineLoadingFather(false);
        }
    });

    const handleClikApprove = async () => {
        try {
            setIsNewEmail(false);
            setLineLoading(true);
            setLineLoadingFather(true);
            setLoadBtnUpdateEmail(true);
            console.log('handleClikApprove');
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setLineLoading(false);
            setLoadBtnUpdateEmail(false);
            setIsApprove(false);
            setIsNewEmail(true);
            setLineLoadingFather(true);
            setLineLoadingFather(false);
        }
    };

    const classField = clsx(
        'h-full max-w-[300px] rounded-lg border-[0.13rem] px-4 py-[0.3rem] focus:border-[#A6B3FD] focus:outline-none'
    );

    return (
        <div className="">
            {/* lanzar alerta con le nuevo correo */}
            {/* pendiente en AlertInfo: lograr que el div obtenga el mismo  ancho que lo demás elementos.. */}
            {isNewEmail && (
                <AlertInfo duration={3} type="user_settings">
                    <Text
                        text={
                            <>
                                {
                                    UserMessages.profileConfiguration.sections
                                        .updateEmail.newEmailSuccess
                                }
                                <label className="font-[470] text-emerald-800">
                                    {userDTO.email}
                                </label>
                            </>
                        }
                        className="my-3 rounded-lg bg-[#EBF9F0] text-center text-emerald-700"
                        sizeOffset={15}
                    />
                </AlertInfo>
            )}
            {/*  Si el usuario abre el corero de verificación... */}
            {isApprove ? (
                <div className="rounded-2xl bg-blue-50 p-5">
                    <button
                        className="mx-auto flex w-full max-w-[260px] flex-col items-center rounded-2xl bg-blue-50/30 px-6"
                        onClick={handleClikApprove}
                    >
                        <ProfileButtomForm
                            lineLoading={lineLoading}
                            buttonLoading={loadBtnUpdateEmail}
                            icon={null}
                            shape="square"
                            nameButtom={
                                UserMessages.profileConfiguration.sections
                                    .updateEmail.confirmButton
                            }
                        />
                    </button>
                </div>
            ) : (
                <div className="grid items-center justify-items-center rounded-2xl bg-blue-50/70 py-5">
                    <div className="mx-auto flex w-full max-w-[260px] flex-col items-center rounded-md bg-[#EBF9F0]">
                        {/*  Se muestar notificación con el envió del correo de verificación */}
                        {emailChangeSucceeded && (
                            <NotificationModal
                                type="notification"
                                setLaunchModal={setEmailChangeSucceeded}
                                titleText={
                                    <div className="mx-auto flex flex-col items-center justify-center px-6">
                                        <Text
                                            text={
                                                UserMessages
                                                    .profileConfiguration
                                                    .sections.updateEmail
                                                    .checkInbox
                                            }
                                            className="mb-4 text-emerald-700"
                                            sizeOffset={10}
                                        />

                                        <OpenMailbox typeStyle="profileConfiguration" />
                                    </div>
                                }
                            />
                        )}
                    </div>
                    {/* Formulario para el cambio de correo  */}
                    <form onSubmit={onSubmit}>
                        <InputText
                            variant="verified"
                            sizeText={2}
                            fullWidth={true}
                            sizeTextInput={-0.1}
                            inputClass={classField}
                            text={
                                <div className="flex items-center gap-2">
                                    {
                                        UserMessages.profileConfiguration
                                            .sections.updateEmail.newEmailLabel
                                    }
                                    <label className="rounded-lg bg-indigo-100 p-[0.08rem] px-1 font-[450] text-indigo-700">
                                        {
                                            UserMessages.profileConfiguration
                                                .sections.updateEmail.badge
                                        }
                                    </label>
                                </div>
                            }
                            type="text"
                            placeholder={Messages.placeholder.emailExample}
                            {...emailRegister}
                            isError={Boolean(errors.email)}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.email?.message}
                            />
                        </InputText>

                        <InputText
                            sizeText={2}
                            fullWidth={true}
                            sizeTextInput={-0.1}
                            inputClass={classField}
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updateEmail.confirmEmailLabel
                            }
                            type="text"
                            placeholder={Messages.placeholder.emailExample}
                            {...reemailRegister}
                            isError={Boolean(errors.reemail)}
                            minWidth={260}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.reemail?.message}
                            />
                        </InputText>

                        <button
                            type="submit"
                            disabled={disabled}
                            className="mt-5 w-full"
                        >
                            <ProfileButtomForm
                                disabled={disabled}
                                lineLoading={lineLoading}
                                buttonLoading={loadBtnUpdateEmail}
                                icon={null}
                                shape="square"
                                nameButtom={
                                    UserMessages.profileConfiguration.sections
                                        .updateEmail.updateButton
                                }
                                isError={
                                    Boolean(errors.reemail) ||
                                    Boolean(errors.email) ||
                                    Boolean(errors.root)
                                }
                            />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdateEmailSection;
