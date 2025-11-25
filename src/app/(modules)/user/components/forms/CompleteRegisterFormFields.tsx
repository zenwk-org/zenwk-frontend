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
}

/**
 * Sonar. Componentes auxiliares
 * @param param0
 * @returns
 */
const InputTextWithError = ({
    label,
    placeholder,
    registerProps,
    error,
    classField,
    editDataBasic,
}: {
    label: string;
    placeholder: string;
    registerProps: any;
    error?: string;
    classField: string;
    editDataBasic?: boolean;
}) => (
    <InputText
        text={label}
        placeholder={placeholder}
        {...registerProps}
        isError={Boolean(error)}
        sizeTextInput={editDataBasic ? -0.1 : 0}
        sizeText={editDataBasic ? 2 : 5}
        inputClass={classField}
        variant={editDataBasic ? 'editPerson' : 'default'}
    >
        <div className="max-w-[180px] overflow-hidden py-1">
            <FormErrorUser sizeOffset={-15} error={error ?? ''} />
        </div>
    </InputText>
);

/**
 * Sonar. Componentes auxiliares
 * @param param0
 * @returns
 */
const SelectWithError = ({
    control,
    name,
    rules,
    variant,
    sizeTextInput,
    paramHeigth,
    text,
    data,
    placeholder,
    optionsLabel,
    error,
}: any) => (
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
            <SelectGeneral
                {...field}
                variant={variant}
                sizeTextInput={sizeTextInput}
                paramHeigth={paramHeigth}
                text={text}
                data={data}
                placeholder={placeholder}
                optionsLabel={optionsLabel}
                isError={Boolean(error)}
            >
                <FormErrorUser sizeOffset={-15} error={error ?? ''} />
            </SelectGeneral>
        )}
    />
);

/**
 * Componente principal
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
}: Props) => {
    const {
        watch,
        control,
        register,
        formState: { errors },
    } = form;

    const [btnDisabled, setBtnDisabled] = useState(true);
    const defaultValues = form.control._defaultValues;

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

    const handleDisabledButton = () =>
        setTimeout(() => setBtnDisabled(true), 50);

    return (
        <form onSubmit={onSubmit}>
            {/* Nombres */}
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${editDataBasic ? 'text-black' : 'text-gray-500'}`}
            >
                <InputTextWithError
                    label="Primer nombre"
                    placeholder={
                        UserMessages.formComplete.placeholder.firstName
                    }
                    registerProps={register('firstName', {
                        required: requiredFirstName,
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                        validate: validateTrim,
                    })}
                    error={errors.firstName?.message ?? errors.root?.message}
                    classField={classField}
                    editDataBasic={editDataBasic}
                />
                <InputTextWithError
                    label={UserMessages.formComplete.labels.middleName}
                    placeholder={
                        UserMessages.formComplete.placeholder.middleName
                    }
                    registerProps={register('middleName', {
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                    })}
                    error={errors.middleName?.message ?? errors.root?.message}
                    classField={classField}
                    editDataBasic={editDataBasic}
                />
            </div>

            {/* Apellidos */}
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${editDataBasic ? 'text-black' : 'text-gray-500'}`}
            >
                <InputTextWithError
                    label={UserMessages.formComplete.labels.lastName}
                    placeholder={UserMessages.formComplete.placeholder.lastName}
                    registerProps={register('lastName', {
                        required: requiredLastName,
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                        validate: validateTrim,
                    })}
                    error={errors.lastName?.message ?? errors.root?.message}
                    classField={classField}
                    editDataBasic={editDataBasic}
                />
                <InputTextWithError
                    label={UserMessages.formComplete.labels.middleLastName}
                    placeholder={
                        UserMessages.formComplete.placeholder.middleLastName
                    }
                    registerProps={register('middleLastName', {
                        pattern: patternName,
                        minLength: minLengthName,
                        maxLength: maxLengthName,
                    })}
                    error={
                        errors.middleLastName?.message ?? errors.root?.message
                    }
                    classField={classField}
                    editDataBasic={editDataBasic}
                />
            </div>

            {/* Sexo y Edad */}
            <div
                className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${!editDataBasic && 'mb-6'}`}
            >
                <SelectWithError
                    control={control}
                    name="sex"
                    rules={{ required: requiredSex }}
                    variant={editDataBasic ? 'editPerson' : 'newUser'}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    paramHeigth={editDataBasic ? -4 : 0}
                    text={UserMessages.formComplete.labels.sex}
                    data={optionsSex}
                    placeholder={UserMessages.formComplete.sex.placeholder}
                    optionsLabel={UserMessages.formComplete.sex.labelOption}
                    error={errors.sex?.message ?? errors.root?.message}
                />
                <SelectWithError
                    control={control}
                    name="age"
                    rules={{ required: requiredAge }}
                    variant={editDataBasic ? 'editPerson' : 'newUser'}
                    sizeTextInput={editDataBasic ? -0.1 : 0}
                    paramHeigth={editDataBasic ? -4 : 0}
                    text={UserMessages.formComplete.labels.age}
                    data={ageGenerator}
                    placeholder={UserMessages.formComplete.age.placeholder}
                    optionsLabel={UserMessages.formComplete.age.labelOption}
                    error={errors.age?.message ?? errors.root?.message}
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

            {/* Botones */}
            {editDataBasic ? (
                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        className="flex w-full"
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
                        onClick={handleDisabledButton}
                    >
                        <ProfileButtomForm
                            disabled={btnDisabled}
                            classColor="yellow"
                            icon={null}
                            shape="square"
                            nameButtom={UserMessages.buttons.save}
                            lineLoading={isBtnLoading}
                            buttonLoading={isBtnLoading}
                        />
                    </button>
                </div>
            ) : (
                <LoadButton
                    loading={isBtnLoading}
                    isError={Object.keys(errors).length > 0}
                    textButton={UserMessages.buttons.welcome.buttonSave}
                />
            )}
        </form>
    );
};

export default CompleteRegisterFormFields;
