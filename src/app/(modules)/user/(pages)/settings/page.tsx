'use client';
import React, { useState } from 'react';

import Spinner from '@app/shared/ui/Spinner';
import Title from '@user/ui/user-feed/Title';
import ProfileItemConfiguration from '@user/components/profile/ProfileItemConfiguration';
import UpdateEmailSection from '@user/ui/profile/UpdateEmailSection';
import UpdatePasswordSection from '@user/ui/profile/UpdatePasswordSection';
import DeleteAccount from '@user/ui/profile/DeleteAccount';
import Text from '@user/ui/user-feed/Text';

import { UserMessages } from '@user/constants/user-messages';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
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
            <div className="mx-auto w-full max-w-xl place-items-center overflow-hidden rounded-xl bg-white py-5 sm:px-6 md:px-10">
                <div className="text-center">
                    <Title
                        sizeOffset={25}
                        text={UserMessages.profileConfiguration.header.title}
                        // className="mt-5 font-[380] text-[#333333]"
                        className={`rounded-x w-full rounded-2xl bg-yellow-50 p-5 text-center text-black`}
                    />
                    {/** Encabezado de la sección */}
                    <ProfileItemHeader lineLoading={lineLoading} />

                    <div className="w-full py-5 text-justify">
                        <ul>
                            {/** Sección: imagen */}

                            {/** Sección: información personal */}

                            {/** Sección: Actualizar email */}
                            <ProfileItemConfiguration
                                text={
                                    <div className="flex items-center gap-2">
                                        {
                                            UserMessages.profileConfiguration
                                                .sections.updateEmail.title
                                        }
                                        <Text
                                            text={
                                                UserMessages
                                                    .profileConfiguration
                                                    .sections.updateEmail.badge
                                            }
                                            className="rounded-lg bg-indigo-100 px-[0.3rem]"
                                        />
                                    </div>
                                }
                                description={UserMessages.profileConfiguration.sections.updateEmail.description(
                                    userDTO.email
                                )}
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
                                    <UpdateEmailSection userDTO={userDTO} />
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
                                    <UpdatePasswordSection />
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
                                        .deleteAccount.description
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
