import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { UserX, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { UserMessages } from '@user/constants/user-messages';

import Text from '@user/ui/user-feed/Text';
import CloseButtom from './CloseButtom';

/**
 * Componente modal de confirmación para eliminación.
 */
const ConfirmModalDelete = ({
    setConfirm,
    setLaunchModal,
    titleText,
    btConfirmText,
}: {
    setConfirm: Dispatch<SetStateAction<boolean>>;
    setLaunchModal: Dispatch<SetStateAction<boolean>>;
    titleText: React.ReactNode;
    btConfirmText: string;
}) => {
    const router = useRouter();
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Activa animación de entrada al montarse
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    // Animación cerrar modal de confirmación.
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setLaunchModal(false);
            setIsClosing(false);
        }, 400); // coincide con duration-400
    };

    /**
     * Acción eliminar
     */
    const handleDelete = () => {
        setIsDelete(true);
        setConfirm(true);

        let seconds = 10;
        setCountdown(seconds);

        const interval = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);

            if (seconds <= 0) {
                clearInterval(interval);
                // Redirige al inicio
                router.push('/');
            }
        }, 1000);
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
                <div
                    className={`relative rounded-2xl ${isDelete ? 'bg-[#EBF9F0]' : 'bg-white'} shadow-sm dark:bg-gray-700`}
                >
                    <div className="p-4 text-center md:p-5">
                        {isDelete ? (
                            // Estado de eliminación en progreso con conteo
                            <div className="flex flex-col items-center">
                                <Text
                                    text="¡Listo! Tu cuenta ha sido  eliminada con éxito."
                                    sizeOffset={10}
                                    className="mx-auto mt-5 rounded-2xl text-center font-[470] text-emerald-800"
                                />
                                <Loader2
                                    size={30}
                                    strokeWidth={1.6}
                                    className="my-3 animate-spin text-emerald-700"
                                />

                                <Text
                                    text={
                                        <>
                                            {
                                                UserMessages
                                                    .profileConfiguration
                                                    .sections.deleteAccount
                                                    .succesMessageRedirect
                                            }
                                            <label className="font-[500] text-emerald-700">{`${countdown} ${UserMessages.profileConfiguration.sections.deleteAccount.second}`}</label>
                                        </>
                                    }
                                    sizeOffset={8}
                                    className="mb-5 text-black"
                                />
                            </div>
                        ) : (
                            <div>
                                {/** botón cerrar */}
                                <CloseButtom handleClose={handleClose} />
                                {/** Contenido modal */}
                                <UserX
                                    size={25}
                                    strokeWidth={1.6}
                                    className="mx-auto mb-4 text-black"
                                />

                                <Text
                                    text={titleText}
                                    sizeOffset={5}
                                    className="mb-5 text-black"
                                />
                                <button
                                    type="button"
                                    className=""
                                    onClick={handleDelete}
                                >
                                    <Text
                                        text={btConfirmText}
                                        className="cursor-pointer rounded-lg bg-[#E1564C] p-[0.3rem] px-3 text-white hover:bg-[#DA3125]"
                                        sizeOffset={0}
                                    />
                                </button>
                                <button
                                    onClick={handleClose}
                                    type="button"
                                    className="ms-3"
                                >
                                    <Text
                                        text="Cancelar"
                                        className="cursor-pointer rounded-lg bg-gray-300/60 p-[0.3rem] px-3 text-black/70 hover:bg-gray-300 hover:text-black"
                                        sizeOffset={0}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    // Saca el modal fuera del layout visual usando React Portal.
    // Así, el modal se monta directamente en el <body>,
    //  evitando cualquier restricción de overflow.
    return mounted ? createPortal(modalContent, document.body) : null;
};

export default ConfirmModalDelete;
