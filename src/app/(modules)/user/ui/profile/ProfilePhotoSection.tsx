'use client';

import React, {
    Dispatch,
    SetStateAction,
    useState,
    useRef,
    useEffect,
} from 'react';
import { Camera, Save, Trash2 } from 'lucide-react';
import { getInitials } from '@app/shared/utils/stringUtils';
import { fetchJwtBaseApi } from '@app/helpers/fetch-api';
import { compressImage } from '@user/utils/ImageConvertUtils';
import { updateOrCreatePerson } from '@user/utils/personUtils';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
import { UserMessages } from '@user/constants/user-messages';

import Text from '@user/ui/user-feed/Text';
import ProfileItemHeader from '@user/components/profile/ProfileItemHeader';
import ProfileBotonForm from '@user/components/profile/ProfileButtomForm';
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
 * @param param0
 * @returns
 */
const ProfilePhotoSection = ({
    setLineLoadingFather,
}: {
    setLineLoadingFather?: Dispatch<SetStateAction<boolean>>;
}) => {
    //const ProfilePhotoSection = () => {
    const refLoadPhotoInput = useRef<HTMLInputElement | null>(null);
    const [lineLoading, setLineLoading] = useState(false);
    const [loadPhotoLoading, setLoadPhotoLoading] = useState(false);
    const [savePhotoLoading, setSavePhotoLoading] = useState(false);
    const [deletePhotoLoading, setDeletePhotoLoading] = useState(false);
    const [activeSavePhoto, setActiveSavePhoto] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [photoProfile, setPhotoProfile] = useState<File>();
    const { person, setPerson } = usePersonContext();

    /**
     * Limpiar el objeto URL cuando cambie la imagen o se desmonte el componente
     */
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    /**
     * Cuando el usuario elimina la imagen se reinician los estados correspondientes.
     */
    useEffect(() => {
        if (person && !person.profilePicture) {
            setPreview(null);
            setSavePhotoLoading(false);
            setActiveSavePhoto(false);
            setPhotoProfile(undefined);
        }
    }, [person]);

    /**
     * Cargador hasta que la persona sea definida.
     */
    if (!person || !setLineLoadingFather) {
        return <Spinner />;
    }

    const {
        firstName,
        middleName,
        lastName,
        middleLastName,
        dateOfBirth,
        address,
        age,
        idSex,
        profilePicture,
    } = person;

    /**
     * Animación (spinner)  para avento clic, boton editar y cancelar.
     */
    const loadingLineClick = async (
        action?: 'loadPhoto' | 'savePhoto' | 'deletePhoto'
    ) => {
        try {
            setLineLoading(true);
            setLineLoadingFather(true);
            if (action === 'loadPhoto') {
                setLoadPhotoLoading(true);
                setActiveSavePhoto(true);
            } else if (action === 'savePhoto') {
                setSavePhotoLoading(true);
            } else if (action === 'deletePhoto') {
                setDeletePhotoLoading(true);
            }

            await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (error) {
            throw error;
        } finally {
            setLineLoading(false);
            setLineLoadingFather(false);
            if (action === 'loadPhoto') {
                setLoadPhotoLoading(false);
            } else if (action === 'savePhoto') {
                setSavePhotoLoading(false);
            } else if (action === 'deletePhoto') {
                setDeletePhotoLoading(false);
            }
        }
    };

    /**
     *  Dispara el input invisible a través de su referencia.
     */
    const handleButtonClick = () => {
        refLoadPhotoInput.current?.click();
    };

    /**
     * Encargado de comprimir  y cargar la foto, para luego
     * ser guardada desde el boton "Guardar foto"
     * @param event
     */
    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const compressed = await compressImage(file);
            setPhotoProfile(compressed);

            // Generar preview
            const previewUrl = URL.createObjectURL(compressed);
            setPreview(previewUrl);
        }
    };
    /**
     * Retornar un string con la representación base 64 de la imagen cargada,
     * o false si no existe el archivo
     * @returns
     */
    const getBytesFromPreview = async (): Promise<string | false> => {
        if (photoProfile) {
            return new Promise((resolve, reject) => {
                // Api navegador para leer archivos cargados
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64WithPrefix = reader.result as string;
                    // Elminar mime-type: data:image/jpeg;base64
                    const base64 = base64WithPrefix.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                // Convierte el archivo en base 64
                reader.readAsDataURL(photoProfile);
            });
        }

        return false;
    };

    /**
     * Maneja el evento clic del botón "guardar foto"  llama
     * el api correspondiente para guardar el archivo
     * MultipartFile (java).
     */
    const savePhotoHandleClick = async () => {
        try {
            if (photoProfile) {
                const path = '/persons/profile/upload-photo';
                const formData = new FormData();
                formData.append('file', photoProfile);

                const res = await fetchJwtBaseApi(
                    path,
                    undefined,
                    undefined,
                    formData,
                    'POST'
                );

                // Actualizar  estado  personDTO
                const newPhotoProfile = await getBytesFromPreview();
                await new Promise((resolve) => setTimeout(resolve, 300));
                setPerson((prev) => {
                    if (!prev) {
                        return prev;
                    }
                    const updated = {
                        ...prev,
                        profilePicture: newPhotoProfile,
                    };
                    setSavePhotoLoading(false);
                    setActiveSavePhoto(false);
                    return updated;
                });
            }
        } catch (error) {
            // console.log('error');
            throw error;
        }
    };

    /**
     * Maneja el evento clic del botón "Eliminar foto"  llama
     * el api correspondiente para la foto de perfil
     * MultipartFile (java).
     */
    const deletePhotoHandleClick = async () => {
        try {
            // Si existe una carga previa se elimina la foto en memoría.
            if (activeSavePhoto) {
                setPreview(null);
                setSavePhotoLoading(false);
                setActiveSavePhoto(false);
                return;
            }

            // Actualizo el contexto y se aprovecha valor actualizado para consumo de api
            setPerson((prev) => {
                if (!prev) {
                    return prev;
                }
                const dataUpdate = { ...prev, profilePicture: undefined };
                updateOrCreatePerson(dataUpdate, undefined, true, person.id);
                return dataUpdate;
            });
        } catch (error) {
            throw error;
        }
    };

    // console.log('viewDataBasicProfile -- PersonDTO:', person);
    return (
        <>
            {/** Encabezado de la sección */}
            {/* <ProfileItemHeader lineLoading={lineLoading} /> */}

            {/** Cuerpo de la sección */}
            <div className="grid items-center justify-items-center px-4 py-6">
                {/** Ftoto de perfil */}
                {/* <Text
                    text="Actualizar foto de perfil"
                    className="py-2 font-[350] text-[#0056B3]"
                    sizeOffset={5}
                /> */}
                {/** Ftoto de perfil: Gestión de la imagen de perfil */}
                <div className="flex items-center justify-items-center -space-x-4">
                    <div className="flex items-center justify-center -space-x-4">
                        <div
                            className={`${photoProfile || profilePicture ? 'overflow-hidden' : 'grid items-center justify-items-center'} relative h-25 w-25 rounded-full border-[0.1rem] border-black bg-gray-300`}
                        >
                            {/* Texto por defecto */}
                            {!profilePicture && !preview ? (
                                <Text
                                    text={getInitials(firstName, lastName)}
                                    sizeOffset={20}
                                    className="text-black"
                                />
                            ) : (
                                !preview && (
                                    <img
                                        src={`data:image/jpeg;base64,${profilePicture}`}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                )
                            )}

                            {/* Imagen preview */}
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/** Botón Cargar foto */}
                    <button
                        type="button"
                        onClick={() => {
                            handleButtonClick(); // Activa el input invisible.
                        }}
                        onChange={() => {
                            loadingLineClick('loadPhoto');
                        }}
                    >
                        {/** input invisible */}
                        <input
                            ref={refLoadPhotoInput}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                        <ProfileBotonForm
                            lineLoading={lineLoading}
                            buttonLoading={loadPhotoLoading}
                            icon={
                                <Camera
                                    size={20}
                                    strokeWidth={1.8}
                                    // className="text-[#0056B3]"
                                    className="text-indigo-600 hover:text-indigo-800"
                                />
                            }
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updatePhotoProfile.changeButton
                            }
                            shape="circle"
                        />
                    </button>

                    {/** Botón guardar foto */}
                    <div className="flex gap-2 px-6">
                        {activeSavePhoto && (
                            <button
                                onClick={() => {
                                    loadingLineClick('savePhoto');
                                    savePhotoHandleClick();
                                }}
                                type="button"
                            >
                                <ProfileBotonForm
                                    lineLoading={lineLoading}
                                    buttonLoading={savePhotoLoading}
                                    icon={
                                        <Save
                                            size={20}
                                            strokeWidth={1.8}
                                            // className="text-[#0056B3]"
                                            className="text-indigo-600 hover:text-indigo-800"
                                        />
                                    }
                                    text={
                                        UserMessages.profileConfiguration
                                            .sections.updatePhotoProfile
                                            .saveButton
                                    }
                                    shape="circle"
                                />
                            </button>
                        )}

                        {/** Botón eliminar foto */}
                        {profilePicture && (
                            <button
                                onClick={() => {
                                    loadingLineClick('deletePhoto');
                                    deletePhotoHandleClick();
                                }}
                                type="button"
                            >
                                <ProfileBotonForm
                                    lineLoading={lineLoading}
                                    buttonLoading={deletePhotoLoading}
                                    icon={
                                        <Trash2
                                            size={20}
                                            strokeWidth={1.8}
                                            // className="text-[#0056B3]"
                                            className="text-indigo-600 hover:text-indigo-800"
                                        />
                                    }
                                    text={
                                        UserMessages.profileConfiguration
                                            .sections.updatePhotoProfile
                                            .deleteButton
                                    }
                                    shape="circle"
                                />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-2">
                {/* <hr className="border-gray-200" /> */}
            </div>
        </>
    );
};

export default ProfilePhotoSection;
