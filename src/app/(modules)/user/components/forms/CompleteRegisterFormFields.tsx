import { Controller, UseFormReturn } from 'react-hook-form';
import { UserMessages } from '@user/constants/user-messages';
import { ageGenerator } from '@app/shared/utils/userUtils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { formValidateUser } from '@user/utils/formValidateUser';
import SelectGeneral, { Option } from '@user/ui/inputs/SelectGeneral';

import InputText from '@user/ui/inputs/InputText';
import FormErrorUser from '@user/ui/forms/FormErrorUser';

import ProfileButtomForm from '@user/components/profile/ProfileButtomForm';
import LoadButton from '@auth/components/LoadButton';
import clsx from 'clsx';

/**
 * Interrace que representa los valores del formulario.
 */
export interface FormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    middleLastName: string;
    sex: Option;
    age: Option;
}

interface Props {
    form: UseFormReturn<FormValues>;
    optionsSex: Option[];
    onSubmit: () => void;
    errorBack: string;
    isBtnLoading: boolean;
    editDataBasic?: boolean;
    setEditDataBasic?: Dispatch<SetStateAction<boolean>>;
    loadingLineClick?: () => Promise<void>;
    btnUpdate?: boolean;
}

/**
 * Componente que representa el formulario de persona.
 * @param param0
 * @returns
 */
const CompleteRegisterFormFields = ({
    form,
    optionsSex,
    onSubmit,
    errorBack,
    isBtnLoading,
    editDataBasic,
    setEditDataBasic,
    loadingLineClick,
    btnUpdate,
}: Props) => {
    const {
        watch,
        control,
        register,
        formState: { errors },
    } = form;
    const [btnDisabled, setBtnDisabled] = useState(true);
    const defaultValues = form.control._defaultValues; // Valores por defecto del form
    const {
        requiredLastName,
        requiredAge,
        requiredSex,
        minLengthName,
        maxLengthName,
        patternName,
        requiredFirstName,
        validateTrim,
    } = formValidateUser();

    /**
     * Detecta si algún campo del formulario se edito y
     * habilita el botón guardar (solo en modo edición)
     */
    useEffect(() => {
        const subscription = watch((values) => {
            const hasChanges = Object.keys(defaultValues).some(
                (key) =>
                    values[key as keyof typeof values] !==
                    defaultValues[key as keyof typeof defaultValues]
            );
            setBtnDisabled(!hasChanges);
        });
        return () => subscription.unsubscribe();
    }, [watch, defaultValues]);

    const classField = clsx(
        editDataBasic
            ? 'h-full max-w-[180px] rounded-lg border-[0.13rem] px-4 py-[0.3rem] focus:border-[#A6B3FD] focus:outline-none'
            : 'h-full w-full rounded-lg border-[0.14rem] px-4 py-[0.4rem] focus:outline-none'
    );

    return (
        <form onSubmit={onSubmit} className="">
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${editDataBasic ? 'text-black' : 'text-gray-500'}`}
            >
                <InputText
                    text="Primer nombre"
                    placeholder={
                        UserMessages.formComplete.placeholder.firstName
                    }
                    {...register('firstName', {
                        required: requiredFirstName,
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                        validate: validateTrim,
                    })}
                    isError={Boolean(errors.firstName || errors.root)}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    sizeText={editDataBasic ? 2 : 5}
                    inputClass={classField}
                    fullWidth={true}
                    variant={editDataBasic ? 'editPerson' : 'default'}
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.firstName?.message ?? ''}
                    />
                </InputText>

                <InputText
                    text={UserMessages.formComplete.labels.middleName}
                    placeholder={
                        UserMessages.formComplete.placeholder.middleName
                    }
                    {...register('middleName', {
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                    })}
                    isError={Boolean(errors.middleName || errors.root)}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    sizeText={editDataBasic ? 2 : 5}
                    inputClass={classField}
                    fullWidth={true}
                    variant={editDataBasic ? 'editPerson' : 'default'}
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.middleName?.message ?? ''}
                    />
                </InputText>
            </div>

            {/* Apellidos */}
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${editDataBasic ? 'text-black' : 'text-gray-500'}`}
            >
                <InputText
                    text={UserMessages.formComplete.labels.lastName}
                    placeholder={UserMessages.formComplete.placeholder.lastName}
                    {...register('lastName', {
                        required: requiredLastName,
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                        validate: validateTrim,
                    })}
                    isError={Boolean(errors.lastName || errors.root)}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    sizeText={editDataBasic ? 2 : 5}
                    inputClass={classField}
                    fullWidth={true}
                    variant={editDataBasic ? 'editPerson' : 'default'}
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.lastName?.message ?? ''}
                    />
                </InputText>
                <InputText
                    text={UserMessages.formComplete.labels.middleLastName}
                    placeholder={
                        UserMessages.formComplete.placeholder.middleLastName
                    }
                    {...register('middleLastName', {
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                        pattern: patternName,
                    })}
                    isError={Boolean(errors.middleLastName || errors.root)}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    sizeText={editDataBasic ? 2 : 5}
                    inputClass={classField}
                    fullWidth={true}
                    variant={editDataBasic ? 'editPerson' : 'default'}
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.middleLastName?.message ?? ''}
                    />
                </InputText>
            </div>

            {/* Sexo y edad */}
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${!editDataBasic && 'mb-6'}`}
            >
                <Controller
                    control={control}
                    name="sex"
                    rules={{ required: requiredSex }}
                    render={({ field }) => (
                        <SelectGeneral
                            variant={editDataBasic ? 'editPerson' : 'newUser'}
                            sizeTextInput={editDataBasic ? -0.1 : 0}
                            paramHeigth={editDataBasic ? -4 : 0}
                            text={UserMessages.formComplete.labels.sex}
                            data={optionsSex}
                            placeholder={
                                UserMessages.formComplete.sex.placeholder
                            }
                            optionsLabel={
                                UserMessages.formComplete.sex.labelOption
                            }
                            isError={Boolean(errors.sex || errors.root)}
                            {...field}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.sex?.message ?? ''}
                            />
                        </SelectGeneral>
                    )}
                />

                <Controller
                    control={control}
                    name="age"
                    rules={{ required: requiredAge }}
                    render={({ field }) => (
                        <SelectGeneral
                            variant={editDataBasic ? 'editPerson' : 'newUser'}
                            sizeTextInput={editDataBasic ? -0.1 : 0}
                            paramHeigth={editDataBasic ? -4 : 0}
                            text={UserMessages.formComplete.labels.age}
                            data={ageGenerator}
                            placeholder={
                                UserMessages.formComplete.age.placeholder
                            }
                            optionsLabel={
                                UserMessages.formComplete.age.labelOption
                            }
                            isError={Boolean(errors.age || errors.root)}
                            {...field}
                        >
                            <FormErrorUser
                                sizeOffset={-15}
                                error={errors.age?.message ?? ''}
                            />
                        </SelectGeneral>
                    )}
                />
            </div>

            {/* Error backend */}
            {errorBack && (
                <div className="mb-6">
                    <FormErrorUser
                        sizeOffset={-10}
                        error={
                            <label className="text-center whitespace-pre-line">
                                {errorBack}
                            </label>
                        }
                    />
                </div>
            )}

            {/** Botón crear o editar*/}
            {editDataBasic ? (
                <div className="">
                    <div className="flex gap-5">
                        <button
                            className="flex w-full"
                            type="button"
                            onClick={async () => {
                                if (setEditDataBasic) {
                                    await loadingLineClick?.();
                                    setEditDataBasic((prev) => !prev);
                                }
                            }}
                        >
                            <ProfileButtomForm
                                icon={null}
                                shape="square"
                                nameButtom="Cancelar"
                            />
                        </button>
                        <button
                            type="submit"
                            className="flex w-full"
                            disabled={btnDisabled}
                        >
                            <ProfileButtomForm
                                disabled={btnDisabled}
                                classColor="yellow"
                                icon={null}
                                shape="square"
                                nameButtom={UserMessages.buttons.save}
                                lineLoading={true}
                            />
                        </button>
                    </div>
                </div>
            ) : (
                <LoadButton
                    loading={isBtnLoading}
                    // error global
                    isError={Object.keys(errors).length > 0}
                    textButton={UserMessages.buttons.welcome.buttonSave}
                />
            )}
        </form>
    );
};

export default CompleteRegisterFormFields;
