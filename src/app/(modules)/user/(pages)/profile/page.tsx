'use client';
import React, { useEffect, useState } from 'react';

import Spinner from '@app/shared/ui/Spinner';
import Title from '@user/ui/user-feed/Title';
import ProfileItemConfiguration from '@user/components/profile/ProfileItemConfiguration';
import PersonalInfoSection from '@app/app/(modules)/user/ui/profile/PersonalInfoSection';
import ProfilePhotoSection from '@user/ui/profile/ProfilePhotoSection';
import ProfileItemHeader from '@user/components/profile/ProfileItemHeader';
import AnimatedPage from '@auth/components/AnimatedPage';

import { UserMessages } from '@user/constants/user-messages';
import { useUserContext } from '@user/utils/UseUserContext';
import { usePersonContext } from '@user/utils/UsePersonContext';
import { useBackgroundThemeContext } from '@app/app/(modules)/user/utils/UseBackgroundTheme';

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
    const [lineLoading, setLineLoading] = useState(false);
    const { userDTO } = useUserContext();
    const { person } = usePersonContext();
    const { setBackgroundTheme } = useBackgroundThemeContext();

    useEffect(() => {
        setBackgroundTheme('bg-yellow-100');
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
        } catch {
        } finally {
            setLineLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="mx-auto rounded-xl bg-white py-5 sm:px-6 md:px-10">
                <div className="">
                    <Title
                        sizeOffset={25}
                        text={UserMessages.profileConfiguration.header.title}
                        // className="mt-5 font-[380] text-[#333333]"
                        className={`rounded-x w-full rounded-2xl bg-yellow-50 p-5 text-center text-black`}
                    />
                    {/** Linea de carga en el encabezado de la sección */}
                    <ProfileItemHeader lineLoading={lineLoading} />

                    <div className="w-fit py-5 text-justify">
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
                                isActive={
                                    activeSection === 'updatePhotoProfile'
                                }
                                setClickOption={() =>
                                    setActiveSection(
                                        activeSection === 'updatePhotoProfile'
                                            ? null
                                            : 'updatePhotoProfile'
                                    )
                                }
                            >
                                {activeSection === 'updatePhotoProfile' &&
                                    person && (
                                        <div className="rounded-2xl bg-yellow-50">
                                            <ProfilePhotoSection
                                                setLineLoadingFather={
                                                    setLineLoading
                                                }
                                            />
                                        </div>
                                    )}
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
                                {activeSection === 'updateInfoBasic' &&
                                    person && (
                                        <div>
                                            <PersonalInfoSection
                                                loadingLineClick={
                                                    loadingLineClick
                                                }
                                                setLineLoading={setLineLoading}
                                            />
                                        </div>
                                    )}
                            </ProfileItemConfiguration>
                        </ul>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ProfileConfiguration;
