'use client';

import { useState, Dispatch, SetStateAction } from 'react';

import { useSexOptionsContext } from '@app/shared/utils/UseSexOptionsContext';
import { getLabelById } from '@app/shared/utils/optionsSexUtils';
import { NotebookPen } from 'lucide-react';
import { usePersonContext } from '@app/app/(dashboard)/user/utils/UsePersonContext';
import { UserMessages } from '@app/app/(dashboard)/user/constants/user-messages';

import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import CompleteRegisterForm from '@app/app/(dashboard)/user/ui/forms/CompleteRegisterForm';
import ProfileBotonForm from '@app/app/(dashboard)/user/components/profile/ProfileButtomForm';
import Spinner from '@app/shared/ui/Spinner';

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
const PersonalInfoSection = ({
    loadingLineClick,
    setLineLoading,
}: {
    loadingLineClick?: () => Promise<void>;
    setLineLoading?: Dispatch<SetStateAction<boolean>>;
}) => {
    const { optionsSex } = useSexOptionsContext();
    const [editDataBasic, setEditDataBasic] = useState(false);
    const { person } = usePersonContext();

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

    return (
        <div>
            {/** Cuerpo de la sección */}
            <div className="rounded-2xl bg-yellow-50 px-6 py-3">
                {editDataBasic ? (
                    <div className="flex justify-center">
                        <div className="mb-2">
                            <CompleteRegisterForm
                                editDataBasic={editDataBasic}
                                setEditDataBasic={setEditDataBasic}
                                personDTO={person}
                                setLineLoading={setLineLoading}
                                loadingLineClick={loadingLineClick}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="my-3 flex">
                        <div>
                            {/** Nombres */}
                            <div className="my-3 flex flex-col gap-2 rounded-lg p-1 px-2 text-center text-gray-500 sm:flex-row sm:gap-4">
                                <Text
                                    sizeOffset={10}
                                    text={
                                        UserMessages.formComplete.labels.names
                                    }
                                    className="min-w-[160px] text-black"
                                />
                                <Text
                                    sizeOffset={10}
                                    text={firstName + ' ' + (middleName || '')}
                                    className="text-gray-500"
                                />
                            </div>

                            {/** Apellidos */}
                            <div className="my-3 flex flex-col gap-2 rounded-lg p-1 px-2 text-center text-gray-500 sm:flex-row sm:gap-4">
                                <Text
                                    sizeOffset={10}
                                    text={
                                        UserMessages.formComplete.labels
                                            .surnames
                                    }
                                    className="min-w-[160px] text-black"
                                />
                                <Text
                                    sizeOffset={10}
                                    text={
                                        lastName + ' ' + (middleLastName || '')
                                    }
                                    className="text-gray-500"
                                />
                            </div>

                            {/** Sexo */}
                            <div className="my-3 flex flex-col gap-2 rounded-lg p-1 px-2 text-center text-gray-500 sm:flex-row sm:gap-4">
                                <Text
                                    sizeOffset={10}
                                    text={UserMessages.formComplete.labels.sex}
                                    className="min-w-[160px] text-black"
                                />
                                <Text
                                    sizeOffset={10}
                                    text={getLabelById(optionsSex, idSex)}
                                    className="text-gray-500"
                                />
                            </div>

                            {/** Edad */}
                            <div className="my-3 flex flex-col gap-2 rounded-lg p-1 px-2 text-center text-gray-500 sm:flex-row sm:gap-4">
                                <Text
                                    sizeOffset={10}
                                    text={UserMessages.formComplete.labels.age}
                                    className="min-w-[160px] text-black"
                                />
                                <Text
                                    sizeOffset={10}
                                    text={age}
                                    className="text-gray-500"
                                />
                            </div>

                            {/** Fecha de nacimiento */}
                            <div className="my-3 flex flex-col gap-2 rounded-lg p-1 px-2 text-center text-gray-500 sm:flex-row sm:gap-4">
                                <Text
                                    sizeOffset={10}
                                    text={
                                        UserMessages.formComplete.labels
                                            .dateOfBirth
                                    }
                                    className="min-w-[160px] text-black"
                                />
                                <Text
                                    sizeOffset={10}
                                    text={
                                        dateOfBirth ||
                                        UserMessages.formComplete.placeholder
                                            .dateOfBirth
                                    }
                                    className="text-gray-500"
                                />
                            </div>
                        </div>
                        {/** Botón editar */}
                        <button
                            type="button"
                            onClick={() => {
                                setEditDataBasic((prev) => !prev);
                                loadingLineClick?.();
                            }}
                        >
                            <ProfileBotonForm
                                icon={
                                    <NotebookPen
                                        size={22}
                                        strokeWidth={1.8}
                                        className="text-indigo-700"
                                    />
                                }
                                text={UserMessages.buttons.updatePersonalInfo}
                                shape="circle"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalInfoSection;
