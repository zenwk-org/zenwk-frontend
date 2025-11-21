import React, { useState, ReactNode } from 'react';
import { ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { UserMessages } from '@user/constants/user-messages';

type StatusType = 'success' | 'warning' | 'info' | null;

const statusStyles = {
    success: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-100 dark:from-emerald-900/30 dark:to-green-900/10',
        text: 'text-emerald-700 dark:text-emerald-300',
        icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    },
    warning: {
        bg: 'bg-gradient-to-r from-yellow-50 to-amber-100 dark:from-amber-900/30 dark:to-yellow-900/10',
        text: 'text-amber-700 dark:text-amber-300',
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    },
    info: {
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/10',
        text: 'text-indigo-700 dark:text-indigo-300',
        icon: <Info className="h-4 w-4 text-indigo-500" />,
    },
    null: { bg: '', text: '', icon: <></> },
};

const AccordionItem = ({
    title,
    defaultDescription,
    children,
}: {
    title: string;
    defaultDescription: string;
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<StatusType>(null);
    const [message, setMessage] = useState<string>(defaultDescription);

    const toggleAccordion = () => setIsOpen(!isOpen);

    // Simula actualización con éxito
    const simulateUpdate = () => {
        setStatus('success');
        setMessage(
            UserMessages.profileConfiguration.alerts.updatePasswordSuccess
        );
        setTimeout(() => {
            setStatus(null);
            setMessage(defaultDescription);
        }, 4000);
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Header */}
            <button
                onClick={toggleAccordion}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
                <div className="w-full">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>

                    {/* Mensaje dinámico */}
                    <div
                        className={`mt-1 flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-all duration-500 ${
                            status ? statusStyles[status].bg : ''
                        }`}
                    >
                        {status && statusStyles[status].icon}
                        <span
                            className={`transition-colors ${
                                status
                                    ? statusStyles[status].text
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}
                        >
                            {message}
                        </span>
                    </div>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Contenido */}
            <div
                className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
                    {children}

                    {/* Botón para simular estado */}
                    <button
                        onClick={simulateUpdate}
                        className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        {UserMessages.buttons.save}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Ejemplo de uso
const ProfileSettingsAccordion = () => {
    const { profileConfiguration } = UserMessages;

    return (
        <>
            <AccordionItem
                title={profileConfiguration.sections.updatePassword.title}
                defaultDescription={
                    profileConfiguration.sections.updatePassword.description
                }
            >
                holi
            </AccordionItem>

            <AccordionItem
                title={profileConfiguration.sections.updatePassword.title}
                defaultDescription={
                    profileConfiguration.sections.updatePassword.description
                }
            >
                holi
            </AccordionItem>

            <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <AccordionItem
                    title={profileConfiguration.sections.updatePassword.title}
                    defaultDescription={
                        profileConfiguration.sections.updatePassword.description
                    }
                >
                    <form className="space-y-3">
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                        <input
                            type="password"
                            placeholder="Confirmar contraseña"
                            className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                        />
                    </form>
                </AccordionItem>

                <AccordionItem
                    title={profileConfiguration.sections.updateEmail.title}
                    defaultDescription={profileConfiguration.sections.updateEmail.description(
                        'usuario@correo.com'
                    )}
                >
                    <input
                        type="email"
                        placeholder="Nuevo correo"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                    />
                </AccordionItem>
            </div>
        </>
    );
};

export default ProfileSettingsAccordion;
