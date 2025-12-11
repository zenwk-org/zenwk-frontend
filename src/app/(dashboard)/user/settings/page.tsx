'use client';
import React, { useState, useEffect } from 'react';
import { UserMessages } from '@app/lib/modules/user/constants/user-messages';
import { useUserContext } from '@app/hooks/modules/user/useUserContext';
import { useBackgroundThemeContext } from '../../utils/useBackgroundTheme';

import Spinner from '@app/shared/ui/Spinner';
import Title from '@app/app/(dashboard)/user/ui/user-feed/Title';
import ProfileItemConfiguration from '@app/components/modules/user/profile/ProfileItemConfiguration';
import UpdateEmailSection from '@app/components/modules/user/profile/UpdateEmailSection';
import UpdatePasswordSection from '@app/components/modules/user/profile/UpdatePasswordSection';
import DeleteAccount from '@app/components/modules/user/profile/DeleteAccount';
import AnimatedPage from '@app/components/modules/auth/commons/AnimatedPage';
import ProfileItemHeader from '@app/components/modules/user/profile/ProfileItemHeader';

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

    const { setBackgroundTheme } = useBackgroundThemeContext();

    useEffect(() => {
        setBackgroundTheme('bg-blue-100');
    }, []);

    if (!userDTO) {
        return <Spinner />;
    }

    return (
        <AnimatedPage>
            <div className="py-7">
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
        </AnimatedPage>
    );
};

export default SettingsAccount;
