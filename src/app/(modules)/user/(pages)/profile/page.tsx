'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const ProfileConfiguration = () => {
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

    if (!userDTO) return <Spinner />;

    const loadingLineClick = async () => {
        try {
            setLineLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 200));
        } finally {
            setLineLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <motion.div
                layout
                transition={{
                    layout: { duration: 0.1, ease: 'easeInOut' },
                }}
                className="mx-auto rounded-xl bg-white py-5 sm:px-6 md:px-10"
            >
                <Title
                    sizeOffset={25}
                    text={UserMessages.profileConfiguration.header.title}
                    className="rounded-x w-full rounded-2xl bg-yellow-50 p-5 text-center text-black"
                />
                <ProfileItemHeader lineLoading={lineLoading} />

                <div className="w-fit py-5 text-justify">
                    <ul>
                        {/* Sección: imagen */}
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
                            <AnimatePresence initial={false}>
                                {activeSection === 'updatePhotoProfile' &&
                                    person && (
                                        <div className="overflow-hidden rounded-2xl bg-yellow-50">
                                            <ProfilePhotoSection
                                                setLineLoadingFather={
                                                    setLineLoading
                                                }
                                            />
                                        </div>
                                    )}
                            </AnimatePresence>
                        </ProfileItemConfiguration>

                        {/* Sección: información personal */}
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
                            <AnimatePresence initial={false}>
                                {activeSection === 'updateInfoBasic' &&
                                    person && (
                                        <div className="overflow-hidden">
                                            <PersonalInfoSection
                                                loadingLineClick={
                                                    loadingLineClick
                                                }
                                                setLineLoading={setLineLoading}
                                            />
                                        </div>
                                    )}
                            </AnimatePresence>
                        </ProfileItemConfiguration>
                    </ul>
                </div>
            </motion.div>
        </AnimatedPage>
    );
};

export default ProfileConfiguration;
