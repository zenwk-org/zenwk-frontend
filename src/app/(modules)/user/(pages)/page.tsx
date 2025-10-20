'use client';
import { useState } from 'react';
import { UserMessages } from '../constants/user-messages';
import { UserStateEnum } from '@app/app/(modules)/user/types/user-dto';
import {
    TEXT_CYAN_COLOR,
    TEXT_VIOLET_REDDISH,
} from '@app/styles/constans-color';
import { usePersonContext } from '@app/app/(modules)/user/utils/usePersonContext';
import { useUserContext } from '@app/app/(modules)/user/utils/useUserContext';

import Title from '@user/ui/user-feed/Title';
import CompleteRegisterForm from '@user/ui/forms/CompleteRegisterForm';
import Text from '@user/ui/user-feed/Text';
import AlertInfo from '@app/shared/components/AlertInfo';

/** Componente encargado de consultar el usuario con los datos envidados después del login.
 * Si el jwt ha esxpirado retorna a la pagina del login.
 */
const WelcomeUser = () => {
    const [isCreatePerson, setIsCreatePerson] = useState(false);
    const { person } = usePersonContext();
    const { userDTO } = useUserContext();

    /**
     * Componente JSX con la pagina del usuario
     */
    return (
        <div className="mx-auto grid max-w-lg select-none">
            <Title
                sizeOffset={0}
                text={
                    <div
                        className={`mb-5 inline-block text-center ${TEXT_CYAN_COLOR} font-[300] tracking-tight`}
                    >
                        {UserMessages.welcome.title}
                        <label className="font-medium">
                            {person?.firstName}
                        </label>
                        {UserMessages.welcome.subtitle}
                    </div>
                }
            />

            {/** Formulario para completar los datos personales */}
            <div className="">
                {!isCreatePerson &&
                    userDTO != undefined &&
                    userDTO.state === UserStateEnum.INCOMPLETE_PERFIL && (
                        <div className="mx-auto max-w-lg place-items-center rounded-xl bg-white px-5 py-5 shadow-2xs">
                            <article className="mb-4 px-12">
                                <Title
                                    sizeOffset={-5}
                                    text={UserMessages.welcome.completeRegister}
                                    className={`text-center font-[370] text-cyan-800`}
                                />
                                <CompleteRegisterForm
                                    setIsCreatePerson={setIsCreatePerson}
                                    // user={userData}
                                />
                            </article>
                        </div>
                    )}

                {isCreatePerson && (
                    <AlertInfo duration={3}>
                        <Text
                            sizeOffset={4}
                            text={
                                <div
                                    className={`font-[350] ${TEXT_VIOLET_REDDISH} rounded-xl bg-white p-5 text-center shadow-xl`}
                                >
                                    {
                                        'Tus datos personales se han actualizado correctamente. ¡Gracias por mantener tu información al día!'
                                    }
                                </div>
                            }
                        />
                    </AlertInfo>
                )}
            </div>
        </div>
    );
};

export default WelcomeUser;
