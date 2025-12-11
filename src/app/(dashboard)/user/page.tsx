'use client';
import { useState, useEffect } from 'react';
import { UserMessages } from '../constants/user-messages';
import { UserStateEnum } from '@app/app/(dashboard)/user/types/user-dto';
import { usePersonContext } from '@app/hooks/modules/user/UsePersonContexu';
import { useUserContext } from '@app/hooks/modules/user/useUserContext';

import CompleteRegisterForm from '@app/components/ui/forms/CompleteRegisterForm';
import Text from '@app/app/(dashboard)/user/ui/user-feed/Text';
import AlertInfo from '@app/shared/components/AlertInfo';
import AnimatedPage from '@app/components/modules/auth/commons/AnimatedPage';
import HeaderAction from '@app/components/modules/auth/commons/HeaderAction';
import { motion } from 'framer-motion';

/** Componente encargado de consultar el usuario con los datos envidados después del login.
 * Si el jwt ha esxpirado retorna a la pagina del login.
 */
const WelcomeUser = () => {
    const [isCreatePerson, setIsCreatePerson] = useState(false);
    const { person } = usePersonContext();
    const { userDTO } = useUserContext();
    const [position, setPosition] = useState<'start' | 'center' | 'end'>(
        'center'
    );

    useEffect(() => {
        if (person?.firstName && person?.lastName) {
            setPosition('start');

            if (isCreatePerson) {
                const timer = setTimeout(() => {
                    setIsCreatePerson(false);
                }, 4 * 1000); // Espera 4 segundos

                return () => clearTimeout(timer);
            }
        }
    }, [person, isCreatePerson, setPosition]);

    /**
     * Componente JSX con la pagina del usuario
     */
    return (
        <AnimatedPage align={position}>
            <div className="">
                {/* Solo se muestra ese mensaje cuando la persona esta creada */}
                {!isCreatePerson && person?.firstName && person?.lastName && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                    >
                        <Text
                            sizeOffset={15}
                            text={
                                <div
                                    className={`rounded-x mt-3 w-full rounded-2xl px-10 py-5 text-center font-[375] text-gray-600 shadow`}
                                >
                                    {UserMessages.welcome.title}
                                    <label className="font-[400] text-[#5280DA]">
                                        {person?.firstName}
                                    </label>
                                    {UserMessages.welcome.subtitle}
                                </div>
                            }
                        />
                    </motion.div>
                )}

                {/** Formulario para completar los datos personales */}
                <div className="mx-auto flex w-full max-w-[250px] items-center py-5 select-none sm:max-w-[500px]">
                    {!isCreatePerson &&
                        userDTO != undefined &&
                        userDTO.state === UserStateEnum.INCOMPLETE_PERFIL && (
                            <div className="flex items-center justify-center">
                                <article className="mb-4 px-12">
                                    <HeaderAction
                                        title={
                                            UserMessages.welcome
                                                .completeRegister
                                        }
                                    />
                                    <p className="mb-7" />
                                    <CompleteRegisterForm
                                        setIsCreatePerson={setIsCreatePerson}
                                    />
                                </article>
                            </div>
                        )}

                    {/* Notificacion isCreatePerson*/}
                    {isCreatePerson && (
                        <AlertInfo duration={3}>
                            <Text
                                sizeOffset={20}
                                text={
                                    <div className="my-3 rounded-lg bg-[#EBF9F0] p-1 text-center font-[330] text-emerald-800">
                                        {UserMessages.welcome.successMessage}
                                    </div>
                                }
                            />
                        </AlertInfo>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default WelcomeUser;
