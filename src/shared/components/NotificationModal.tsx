import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UserMessages } from '@user/constants/user-messages';

import Text from '@user/ui/user-feed/Text';
import CloseButtom from './CloseButtom';

/**
 * Componente modal de confirmación para eliminación.
 */
const NotificationModal = ({
    type,
    setLaunchModal,
    titleText,
}: {
    setLaunchModal: Dispatch<SetStateAction<boolean>>;
    type?: 'default' | 'notification';
    titleText: React.ReactNode;
}) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    // pendiente hacer dinamico limite tiempo..
    const [countdown, setCountdown] = useState(30);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    /**
     *  Activa animación de entrada al montarse
     */
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    /**
     * Conteo regresivo
     */
    useEffect(() => {
        let seconds = 30;
        setCountdown(seconds);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    /**
     * Cuando countdown llega a 0, cierra el modal
     */
    useEffect(() => {
        if (countdown === 0) {
            handleClose();
        }
    }, [countdown]);

    /**
     *  Cerrar modal de confirmación.
     */
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setLaunchModal(false);
        }, 200);
    };

    const modalContent = (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black/40 transition-opacity duration-400 ease-in-out select-none ${
                isClosing ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div
                className={`relative max-h-full w-full max-w-md transform p-4 transition-all duration-400 ease-in-out ${
                    isClosing || !isVisible
                        ? 'scale-95 opacity-0'
                        : 'scale-100 opacity-100'
                }`}
            >
                {/*Caja modal */}
                <div
                    className={`relative rounded-2xl bg-[#EBF9F0] p-7 shadow-sm dark:bg-gray-700`}
                >
                    <div className="text-center">
                        <div>
                            {/** botón cerrar */}
                            <CloseButtom
                                handleClose={handleClose}
                                type={type}
                            />
                            {/** Contenido modal */}
                            <Text
                                text={titleText}
                                className="mb-3 text-black"
                            />

                            <Text
                                text={
                                    <>
                                        {
                                            UserMessages.profileConfiguration
                                                .sections.updateEmail
                                                .succesMessageRedirect
                                        }
                                        <label className="font-[500] text-emerald-700">{`${countdown} ${UserMessages.profileConfiguration.sections.deleteAccount.second}`}</label>
                                    </>
                                }
                                sizeOffset={8}
                                className="text-black"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
};

export default NotificationModal;
