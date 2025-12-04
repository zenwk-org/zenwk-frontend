import { useForm } from 'react-hook-form';
import React, { useState, Dispatch, SetStateAction } from 'react';
import { PersonDTO } from '@user/types/person-dto';
import { getLabelById } from '@app/shared/utils/optionsSexUtils';
import {
    getPerson,
    updateOrCreatePerson,
    getPathId,
} from '@user/utils/personUtils';
import { safeValue } from '@app/shared/utils/stringUtils';
import { useSexOptionsContext } from '@app/shared/utils/UseSexOptionsContext';
import { handleApiErrors } from '@app/shared/utils/formValidate';
import { usePersonContext } from '@user/utils/UsePersonContext';
import { useUserContext } from '@user/utils/UseUserContext';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';

import CompleteRegisterFormFields from '@user/components/forms/CompleteRegisterFormFields';

type FormValues = {
    firstName: string;
    middleName: string;
    lastName: string;
    middleLastName: string;
    sex: any;
    age: any;
    profilePicture?: string | boolean;
};

/**
 *  Componente que gestiona la creación o modificación de la entidad persona.
 * @param param0
 * @returns
 */
const CompleteRegisterForm = ({
    setIsCreatePerson,
    editDataBasic,
    setEditDataBasic,
    personDTO,
    setLineLoading,
    setBtnUpdate,
    loadingLineClick,
}: {
    setIsCreatePerson?: Dispatch<SetStateAction<boolean>>;
    editDataBasic?: boolean;
    setEditDataBasic?: Dispatch<SetStateAction<boolean>>;
    personDTO?: PersonDTO;
    setLineLoading?: Dispatch<SetStateAction<boolean>>;
    setBtnUpdate?: Dispatch<SetStateAction<boolean>>;
    loadingLineClick?: () => Promise<void>;
}) => {
    const { optionsSex } = useSexOptionsContext();
    const [errorBack, setErrorBack] = useState<{
        msg: string;
        at: number;
    } | null>(null);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const { person, setPerson } = usePersonContext();
    const { userDTO, setUserDTO } = useUserContext();

    /**
     * Formulario principal
     */
    const form = useForm<FormValues>({
        defaultValues: {
            firstName: personDTO?.firstName,
            middleName: personDTO?.middleName,
            lastName: personDTO?.lastName,
            middleLastName: personDTO?.middleLastName,
            sex: personDTO && {
                label: getLabelById(optionsSex, personDTO.idSex),
                value: personDTO.idSex,
            },
            age: personDTO && {
                label: personDTO.age,
                value: personDTO.age,
            },
            profilePicture: personDTO?.profilePicture,
        },
        mode: 'onChange',
    });

    /**
     * manejador envio de formulario.
     * Si el creación o actualización es éxitosa se debe garantizar la consulta GET api/person/{idPerson}
     * sin un nuevo inicio de sesión, se debe obtener un nuevo jwt y actualizar a nivel
     * de toca la aplicación.
     */
    const onSubmit = form.handleSubmit(async (data) => {
        setIsBtnLoading(true);
        setLineLoading?.(true);
        setBtnUpdate?.(true);

        try {
            if (userDTO) {
                if (editDataBasic && person) {
                    await updateOrCreatePerson(
                        data,
                        undefined,
                        editDataBasic,
                        person.id
                    );
                    setPerson(await getPerson(person.id));
                    setEditDataBasic?.(false);
                } else {
                    const response = await updateOrCreatePerson(
                        data,
                        userDTO,
                        editDataBasic
                    );
                    // Actualización de rol
                    await fetchJwtBaseApi(
                        '/auth/refresh-jwt',
                        undefined,
                        undefined,
                        undefined,
                        'POST'
                    );
                    // Actualizar usuario en contexto
                    const pathUserMe = '/users/me';
                    const userData = await fetchJwtBaseApi(
                        pathUserMe,
                        undefined,
                        undefined,
                        undefined,
                        'GET'
                    );
                    setUserDTO(userData);

                    const id = getPathId(response);
                    setPerson(await getPerson(Number(id)));
                    setIsCreatePerson?.(true);
                }
            }
        } catch (error) {
            handleApiErrors(
                error,
                (backendError: string) => {
                    setErrorBack({
                        msg: backendError,
                        at: Date.now(), // <--- fuerza re-render SIEMPRE
                    });
                },
                safeValue
            );
        } finally {
            setIsBtnLoading(false);
            setLineLoading?.(false);
            setBtnUpdate?.(false);
        }
    });

    return (
        <CompleteRegisterFormFields
            form={form}
            optionsSex={optionsSex}
            onSubmit={onSubmit}
            errorBack={errorBack}
            isBtnLoading={isBtnLoading}
            editDataBasic={editDataBasic}
            setEditDataBasic={setEditDataBasic}
            loadingLineClick={loadingLineClick}
        />
    );
};

export default CompleteRegisterForm;
