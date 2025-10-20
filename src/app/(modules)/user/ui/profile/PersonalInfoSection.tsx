'use client';

import React, { useState, useEffect } from 'react';
import { useSexOptionsContext } from '@user/utils/useSexOptionsContext';
import { getLabelById } from '@app/shared/utils/optionsSexUtils';
import { PencilLine } from 'lucide-react';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';

import Text from '@user/ui/user-feed/Text';
import CompleteRegisterForm from '@user/ui/forms/CompleteRegisterForm';
import ProfileItemHeader from '@user/components/profile/ProfileItemHeader';
import ProfileBotonForm from '@app/app/(modules)/user/components/profile/ProfileButtomForm';
import Spinner from '@app/shared/ui/Spinner';
import { UserMessages } from '@user/constants/user-messages';

interface FormValues {
    firstName: string;
    middleName: string;
    lastName: string;
    middleLastName: string;
    sex: any;
    age: any;
}

/**
 * Componente que gestiona los datos básicos de la persona.
 */
const PersonalInfoSection = () => {
    const { optionsSex } = useSexOptionsContext();
    const [editDataBasic, setEditDataBasic] = useState(false);
    const [lineLoading, setLineLoading] = useState(false);
    const { person } = usePersonContext();
    console.log(person);

    /**
     * Cargador hasta que la persona sea definida.
     */
    if (!person) {
        return <Spinner />;
    }

    const {
        firstName,
        middleName,
        lastName,
        middleLastName,
        dateOfBirth,
        age,
        idSex,
    } = person;

    /**
     * Animación (spinner)  para evento clic, botón editar y cancelar.
     */
    const loadingLineClick = async () => {
        try {
            setLineLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (error) {
            throw error;
        } finally {
            setLineLoading(false);
        }
    };

    return (
        <div>
            {/** Encabezado de la sección */}
            <ProfileItemHeader lineLoading={lineLoading} />

            {/** Cuerpo de la sección */}
            <div className="px-8 py-5">
                {editDataBasic ? (
                    <div className="mx-5 mb-2 grid items-center justify-items-center">
                        <CompleteRegisterForm
                            editDataBasic={editDataBasic}
                            setEditDataBasic={setEditDataBasic}
                            personDTO={person}
                            setLineLoading={setLineLoading}
                            loadingLineClick={loadingLineClick}
                        />
                    </div>
                ) : (
                    <>
                        {/** Nombres */}
                        <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">
                            <Text
                                text={UserMessages.formComplete.labels.names}
                                className="min-w-[160px] font-[370] text-gray-700"
                            />
                            <Text
                                text={firstName + ' ' + (middleName || '')}
                                className="left-0 font-[300] text-gray-500"
                            />
                        </div>

                        {/** Apellidos */}
                        <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">
                            <Text
                                text={UserMessages.formComplete.labels.surnames}
                                className="min-w-[160px] font-[370] text-gray-700"
                            />
                            <Text
                                text={lastName + ' ' + (middleLastName || '')}
                                className="font-[300] text-gray-500"
                            />
                        </div>

                        {/** Sexo */}
                        <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">
                            <Text
                                text={UserMessages.formComplete.labels.sex}
                                className="min-w-[160px] font-[370] text-gray-700"
                            />
                            <Text
                                text={getLabelById(optionsSex, idSex)}
                                className="font-[300] text-gray-500"
                            />
                        </div>

                        {/** Edad */}
                        <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">
                            <Text
                                text={UserMessages.formComplete.labels.age}
                                className="min-w-[160px] font-[370] text-gray-700"
                            />
                            <Text
                                text={age}
                                className="font-[300] text-gray-500"
                            />
                        </div>

                        {/** Fecha de nacimiento */}
                        <div className="m-2 flex flex-col gap-2 rounded-lg bg-white p-1 px-4 text-gray-500 sm:flex-row sm:gap-4">
                            <Text
                                text={
                                    UserMessages.formComplete.labels.dateOfBirth
                                }
                                className="min-w-[160px] font-[370] text-gray-700"
                            />
                            <Text
                                text={
                                    dateOfBirth
                                        ? dateOfBirth
                                        : UserMessages.formComplete.placeholder
                                              .dateOfBirth
                                }
                                className="font-[300] text-gray-500"
                            />
                        </div>

                        {/** Botón editar */}
                        <button
                            type="button"
                            onClick={() => {
                                setEditDataBasic((prev) => !prev);
                                loadingLineClick();
                            }}
                            className="mt-2 w-full px-2 py-2"
                        >
                            <ProfileBotonForm
                                icon={
                                    <PencilLine
                                        size={16}
                                        strokeWidth={1.5}
                                        className="text-gray-600 group-hover:text-black"
                                    />
                                }
                                nameButtom={
                                    UserMessages.buttons.updatePersonalInfo
                                }
                                shape="square"
                            />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInfoSection;
