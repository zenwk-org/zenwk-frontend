'use client';
import React, { useState, useEffect } from 'react';
import { UserMessages } from '@user/constants/user-messages';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
import { useBackgroundThemeContext } from '@user/utils/useBackgroundTheme';

import Spinner from '@app/shared/ui/Spinner';
import Title from '@user/ui/user-feed/Title';
import ProfileItemConfiguration from '@user/components/profile/ProfileItemConfiguration';
import UpdateEmailSection from '@user/ui/profile/UpdateEmailSection';
import UpdatePasswordSection from '@user/ui/profile/UpdatePasswordSection';
import DeleteAccount from '@user/ui/profile/DeleteAccount';
import AnimatedPage from '@auth/components/AnimatedPage';
import ProfileItemHeader from '@user/components/profile/ProfileItemHeader';

/**
 * Componente principal para la configuración del perfil
 */
const SettingsAccount = () => {
    // Controlar secciones abiertas en el acordeón "Configuración de Perfil".
    const [activeSection, setActiveSection] = useState<
        | 'updateInfoBasic'
        | 'updateEmail'
        | 'updatePassword'
        | 'deleteAccount'
        | 'updatePhotoProfile'
        | null
    >(null);
    const [lineLoading, setLineLoading] = useState(false);
    const { userDTO } = useUserContext();
    const { person } = usePersonContext();

    const { setBackgroundTheme } = useBackgroundThemeContext();

    useEffect(() => {
        setBackgroundTheme('bg-blue-100');
    }, []);

    if (!userDTO) {
        return <Spinner />;
    }

    /**
     * Animación (spinner)  para evento clic, botón editar y cancelar.
     */
    const loadingLineClick = async () => {
        try {
            setLineLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
            throw error;
        } finally {
            setLineLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="mx-auto max-w-xl place-items-center overflow-hidden rounded-xl bg-white py-5 select-none sm:px-4 md:px-4">
                <div className="text-center">
                    <Title
                        sizeOffset={25}
                        text={UserMessages.profileConfiguration.header.title}
                        className={`rounded-x w-full rounded-2xl bg-blue-50 p-5 text-center text-black`}
                    />
                    {/** Encabezado de la sección */}
                    <ProfileItemHeader lineLoading={lineLoading} />

                    <div className="w-full py-5 text-justify">
                        <ul>
                            {/** Sección: Actualizar email */}
                            <ProfileItemConfiguration
                                text={
                                    <div className="flex items-center gap-2">
                                        {
                                            UserMessages.profileConfiguration
                                                .sections.updateEmail.title
                                        }
                                    </div>
                                }
                                description={
                                    <>
                                        {
                                            UserMessages.profileConfiguration
                                                .sections.updateEmail
                                                .descriptionText
                                        }
                                        <label className="font-[400] text-indigo-500">
                                            {userDTO.email}
                                        </label>
                                    </>
                                }
                                isActive={activeSection === 'updateEmail'}
                                setClickOption={() =>
                                    setActiveSection(
                                        activeSection === 'updateEmail'
                                            ? null
                                            : 'updateEmail'
                                    )
                                }
                            >
                                {activeSection === 'updateEmail' && (
                                    <UpdateEmailSection
                                        setLineLoadingFather={setLineLoading}
                                        userDTO={userDTO}
                                    />
                                )}
                            </ProfileItemConfiguration>

                            {/** Sección: Cambiar contraseña */}
                            <ProfileItemConfiguration
                                text={
                                    UserMessages.profileConfiguration.sections
                                        .updatePassword.title
                                }
                                isActive={activeSection === 'updatePassword'}
                                setClickOption={() =>
                                    setActiveSection(
                                        activeSection === 'updatePassword'
                                            ? null
                                            : 'updatePassword'
                                    )
                                }
                            >
                                {activeSection === 'updatePassword' && (
                                    <UpdatePasswordSection
                                        setLineLoadingFather={setLineLoading}
                                    />
                                )}
                            </ProfileItemConfiguration>

                            {/** Sección: Eliminar cuenta */}
                            <ProfileItemConfiguration
                                text={
                                    UserMessages.profileConfiguration.sections
                                        .deleteAccount.title
                                }
                                description={
                                    UserMessages.profileConfiguration.sections
                                        .deleteAccount.descriptionComplete
                                }
                                isActive={activeSection === 'deleteAccount'}
                                setClickOption={() =>
                                    setActiveSection(
                                        activeSection === 'deleteAccount'
                                            ? null
                                            : 'deleteAccount'
                                    )
                                }
                            >
                                {activeSection === 'deleteAccount' && (
                                    <DeleteAccount />
                                )}
                            </ProfileItemConfiguration>
                        </ul>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default SettingsAccount;
