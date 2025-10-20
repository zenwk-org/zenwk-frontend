import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { formValidate } from '@app/shared/utils/formValidate';
import { RefreshCcw } from 'lucide-react';

import ProfileItemHeader from '@user/components/profile/ProfileItemHeader';
import InputText from '@user/ui/inputs/InputText';
import FormErrorUser from '@user/ui/forms/FormErrorUser';
import ProfileButtomForm from '@app/app/(modules)/user/components/profile/ProfileButtomForm';
import Text from '@user/ui/user-feed/Text';
import { UserMessages } from '@user/constants/user-messages';

const UpdatePasswordSection = () => {
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
        }
    });

    return (
        <div>
            <ProfileItemHeader lineLoading={lineLoading} />

            <div className="grid items-center justify-items-center py-5">
                {passwordChangeSucceeded && (
                    <div className="mx-auto mb-2 flex w-full max-w-[260px] flex-col items-center rounded-md bg-[#EBF9F0]">
                        <Text
                            text={
                                UserMessages.profileConfiguration.alerts
                                    .updatePasswordSuccess
                            }
                            className="mx-auto max-w-[260px] p-2 text-center text-emerald-700"
                            sizeOffset={-8}
                        />
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="flex-co mx-auto mb-3 flex w-full max-w-[260px]">
                        <InputText
                            variant="verified"
                            minWidth={260}
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updatePassword.currentPassword
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

                    <div className="flex-co mx-auto flex w-full max-w-[260px]">
                        <InputText
                            minWidth={260}
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

                    <div className="flex-co mx-auto flex w-full max-w-[260px]">
                        <InputText
                            minWidth={260}
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

                    <div className="flex-co mx-auto flex w-full max-w-[260px]">
                        <button
                            type="submit"
                            disabled={disabled}
                            className="mt-4 mb-3 w-full"
                        >
                            <ProfileButtomForm
                                disabled={disabled}
                                lineLoading={lineLoading}
                                buttonLoading={loadBtnUpdatePassword}
                                icon={
                                    <RefreshCcw size={17} strokeWidth={1.5} />
                                }
                                shape="square"
                                positionToltip="top"
                                nameButtom={
                                    UserMessages.profileConfiguration.sections
                                        .updatePassword.updateButton
                                }
                            />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordSection;
