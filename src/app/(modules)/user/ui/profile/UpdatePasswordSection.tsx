import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import { UserMessages } from '@user/constants/user-messages';
import { clsx } from 'clsx';

import InputText from '@user/ui/inputs/InputText';
import FormErrorUser from '@user/ui/forms/FormErrorUser';
import ProfileButtomForm from '@app/app/(modules)/user/components/profile/ProfileButtomForm';
import Text from '@user/ui/user-feed/Text';
import AlertInfo from '@app/shared/components/AlertInfo';
import FormError from '@app/shared/ui/FormError';

const UpdatePasswordSection = ({
    setLineLoadingFather,
}: {
    setLineLoadingFather: Dispatch<SetStateAction<boolean>>;
}) => {
    const [disabled, setDisabled] = useState(true);
    const [passwordChangeSucceeded, setPasswordChangeSucceeded] =
        useState(false);
    const [lineLoading, setLineLoading] = useState(false);
    const [loadBtnUpdatePassword, setLoadBtnUpdatePassword] = useState(false);
    const { patternPassword, requiredPassword, validateEquals } =
        formValidate();

    const {
        getValues,
        setValue,
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isValid },
    } = useForm<{
        passwordCurrent: string;
        password: string;
        reepassword: string;
    }>({ mode: 'all' });

    const passwordValue = useWatch({ control, name: 'password' });
    const repasswordValue = useWatch({ control, name: 'reepassword' });

    useEffect(() => {
        if (isValid && repasswordValue?.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [isValid, repasswordValue, getValues, passwordValue]);

    const passwordRegister = register('password', {
        required: requiredPassword,
        pattern: patternPassword,
    });

    const reepasswordRegister = register('reepassword', {
        required: requiredPassword,
        validate: validateEquals(
            getValues('password'),
            UserMessages.profileConfiguration.sections.updatePassword
                .errorNotEquals
        ),
    });

    const onSubmit = handleSubmit(async (data) => {
        setLineLoading(true);
        setLineLoadingFather(true);
        setLoadBtnUpdatePassword(true);
        try {
            console.log(data);
        } catch (error) {
            setError('root', { message: error as string });
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setPasswordChangeSucceeded(true);
            setLineLoading(false);
            setLoadBtnUpdatePassword(false);
            setValue('passwordCurrent', '');
            setValue('password', '');
            setValue('reepassword', '');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setPasswordChangeSucceeded(false);
            setLineLoadingFather(false);
        }
    });

    const classField = clsx(
        'h-full w-full rounded-lg border-[0.13rem] px-4 py-[0.33rem] focus:border-[#A6B3FD] focus:outline-none'
    );

    return (
        <div>
            <div className="grid max-w-[400px] items-center justify-items-center rounded-2xl bg-blue-50/50 py-5">
                {passwordChangeSucceeded && (
                    <div className="mb-2 flex w-full flex-col items-center rounded-md bg-[#EBF9F0]">
                        {/* pendiente en AlertInfo: lograr que el div obtenga el mismo  ancho que lo demás elementos.. */}
                        <AlertInfo duration={3} type="user_settings">
                            <Text
                                text={
                                    UserMessages.profileConfiguration.alerts
                                        .updatePasswordSuccess
                                }
                                className="y-3 rounded-lg bg-[#EBF9F0] px-10 text-center font-[450] text-emerald-700"
                                sizeOffset={15}
                            />
                        </AlertInfo>
                    </div>
                )}

                <form onSubmit={onSubmit} className="max-w-[240px]">
                    <div className="flex-co mx-auto mb-5 flex w-full">
                        <InputText
                            //minWidth={280}
                            minWidth={240}
                            variant="verified"
                            sizeText={2}
                            fullWidth={true}
                            sizeTextInput={-0.1}
                            inputClass={classField}
                            text={
                                <label className="rounded-lg bg-indigo-100 p-[0.09rem] px-1 font-[450] text-indigo-700">
                                    {
                                        UserMessages.profileConfiguration
                                            .sections.updatePassword
                                            .currentPassword
                                    }
                                </label>
                            }
                            type="password"
                            placeholder={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.currentPasswordPlaceholder
                            }
                            {...register('passwordCurrent', {
                                required: requiredPassword,
                                pattern: patternPassword,
                            })}
                            isError={Boolean(errors.passwordCurrent)}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.passwordCurrent?.message ?? ''}
                            />
                        </InputText>
                    </div>

                    <div className="flex-co mx-auto flex w-full">
                        <InputText
                            minWidth={240}
                            sizeText={2}
                            fullWidth={true}
                            sizeTextInput={-0.1}
                            inputClass={classField}
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.newPassword
                            }
                            type="password"
                            placeholder={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.newPasswordPlaceholder
                            }
                            {...passwordRegister}
                            isError={Boolean(errors.password)}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.password?.message ?? ''}
                            />
                        </InputText>
                    </div>

                    <div className="flex-co mx-auto flex w-full">
                        <InputText
                            minWidth={240}
                            sizeText={2}
                            fullWidth={true}
                            sizeTextInput={-0.1}
                            inputClass={classField}
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.confirmPassword
                            }
                            type="password"
                            placeholder={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.confirmPasswordPlaceholder
                            }
                            {...reepasswordRegister}
                            isError={Boolean(errors.reepassword)}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.reepassword?.message ?? ''}
                            />
                        </InputText>
                    </div>

                    <button
                        type="submit"
                        disabled={disabled}
                        className="mt-5 mb-3 w-full"
                    >
                        <ProfileButtomForm
                            disabled={disabled}
                            lineLoading={lineLoading}
                            buttonLoading={loadBtnUpdatePassword}
                            icon={null}
                            shape="square"
                            nameButtom={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.updateButton
                            }
                        />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordSection;
