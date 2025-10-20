import { Controller, UseFormReturn } from 'react-hook-form';
import { UserMessages } from '@user/constants/user-messages';
import { ageGenerator } from '@app/shared/utils/userUtils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import SelectGeneral, { Option } from '@user/ui/inputs/SelectGeneral';

import InputText from '@user/ui/inputs/InputText';
import FormErrorUser from '@user/ui/forms/FormErrorUser';
import Button from '@user/ui/buttons/Button';
import FirstNameField from '@user/components/forms/iputs/FirstNameField';
import Tooltip from '@app/shared/ui/Tooltip';
import ProfileButtomForm from '@user/components/profile/ProfileButtomForm';

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
    requiredLastName: string;
    requiredAge: string;
    requiredSex: string;
    minLengthName: { value: number; message: string };
    maxLengthName: { value: number; message: string };
    patternName: { value: RegExp; message: string };
    validateTrim?: (value: string) => true | string;
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
    requiredLastName,
    requiredAge,
    requiredSex,
    minLengthName,
    maxLengthName,
    patternName,
    validateTrim,
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

    return (
        <form onSubmit={onSubmit} className="">
            {editDataBasic && (
                <button
                    type="button"
                    onClick={async () => {
                        if (setEditDataBasic) {
                            await loadingLineClick?.();
                            setEditDataBasic((prev) => !prev);
                        }
                    }}
                    className="group relative cursor-pointer rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 hover:text-black"
                >
                    <ArrowLeft size={16} strokeWidth={1.7} />
                    <Tooltip position="top">
                        {UserMessages.buttons.back}
                    </Tooltip>
                </button>
            )}

            {/* Nombres 
            <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">

            */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FirstNameField form={form} />

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
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.middleName?.message ?? ''}
                    />
                </InputText>
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                >
                    <FormErrorUser
                        sizeOffset={-15}
                        error={errors.middleLastName?.message ?? ''}
                    />
                </InputText>
            </div>

            {/* Sexo y edad */}
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Controller
                    control={control}
                    name="sex"
                    rules={{ required: requiredSex }}
                    render={({ field }) => (
                        <SelectGeneral
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
                <div className="flex justify-center">
                    <button
                        className="flex w-full items-center justify-items-center gap-5"
                        type="submit"
                        disabled={btnDisabled}
                    >
                        <ProfileButtomForm
                            disabled={btnDisabled}
                            icon={<Save size={17} strokeWidth={1.5} />}
                            shape="square"
                            positionToltip="top"
                            nameButtom={UserMessages.buttons.save}
                            buttonLoading={isBtnLoading}
                            lineLoading={true}
                        />
                    </button>
                </div>
            ) : (
                <Button
                    type="submit"
                    loading={isBtnLoading}
                    text={UserMessages.buttons.welcome.buttonSave}
                />
            )}
        </form>
    );
};

export default CompleteRegisterFormFields;
