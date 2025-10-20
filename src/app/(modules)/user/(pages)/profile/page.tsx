'use client';
import React, { useState } from 'react';

import Spinner from '@app/shared/ui/Spinner';
import Title from '@user/ui/user-feed/Title';
import ProfileItemConfiguration from '@user/components/profile/ProfileItemConfiguration';
import PersonalInfoSection from '@app/app/(modules)/user/ui/profile/PersonalInfoSection';
import UpdateEmailSection from '@user/ui/profile/UpdateEmailSection';
import UpdatePasswordSection from '@user/ui/profile/UpdatePasswordSection';
import DeleteAccount from '@user/ui/profile/DeleteAccount';
import ProfilePhotoSection from '@user/ui/profile/ProfilePhotoSection';
import Text from '@user/ui/user-feed/Text';

import { UserMessages } from '@user/constants/user-messages';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';

/**
 * Componente principal para la configuración del perfil
 */
const ProfileConfiguration = () => {
    // Controlar secciones abiertas en el acordeón "Configuración de Perfil".
    const [activeSection, setActiveSection] = useState<
        | 'updateInfoBasic'
        | 'updateEmail'
        | 'updatePassword'
        | 'deleteAccount'
        | 'updatePhotoProfile'
        | null
    >(null);

    const { userDTO } = useUserContext();
    const { person } = usePersonContext();

    if (!userDTO) {
        return <Spinner />;
    }

    return (
        <div className="mx-auto w-full max-w-xl place-items-center overflow-hidden rounded-xl bg-white px-4 py-5 shadow-2xs sm:px-6 md:px-10">
            <div className="text-center">
                <Title
                    sizeOffset={10}
                    text={UserMessages.profileConfiguration.header.title}
                    className="mt-5 font-[380] text-[#333333]"
                />

                <div className="px-8 py-5 text-justify">
                    <ul>
                        {/** Sección: imagen */}
                        <ProfileItemConfiguration
                            text={
                                UserMessages.profileConfiguration.sections
                                    .updatePhotoProfile.title
                            }
                            description={
                                UserMessages.profileConfiguration.sections
                                    .updatePhotoProfile.description
                            }
                            isActive={activeSection === 'updatePhotoProfile'}
                            setClickOption={() =>
                                setActiveSection(
                                    activeSection === 'updatePhotoProfile'
                                        ? null
                                        : 'updatePhotoProfile'
                                )
                            }
                        >
                            {activeSection === 'updatePhotoProfile' &&
                                person && <ProfilePhotoSection />}
                        </ProfileItemConfiguration>

                        {/** Sección: información personal */}
                        <ProfileItemConfiguration
                            text={
                                UserMessages.profileConfiguration.sections
                                    .personalInfo.title
                            }
                            description={
                                UserMessages.profileConfiguration.sections
                                    .personalInfo.description
                            }
                            isActive={activeSection === 'updateInfoBasic'}
                            setClickOption={() =>
                                setActiveSection(
                                    activeSection === 'updateInfoBasic'
                                        ? null
                                        : 'updateInfoBasic'
                                )
                            }
                        >
                            {activeSection === 'updateInfoBasic' && person && (
                                <PersonalInfoSection />
                            )}
                        </ProfileItemConfiguration>

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
                                            UserMessages.profileConfiguration
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
    );
};

export default ProfileConfiguration;
