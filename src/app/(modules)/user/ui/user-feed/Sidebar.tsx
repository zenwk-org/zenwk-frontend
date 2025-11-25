'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { UserMessages } from '@user/constants/user-messages';
import { useSidebarContext } from '@user/utils/UseWidthSidebarContext';
import { UserStateEnum } from '@user/types/user-dto';
import { useBackgroundThemeContext } from '@user/utils/useBackgroundTheme';
import { useUserContext } from '@user/utils/UseUserContext';

import Text from '@user/ui/user-feed/Text';
import SidebarIcon from '@user/components/icons/SidebarIcon';
import CloseSidebarIcon from '@user/components/icons/CloseSidebarIcon';
import Tooltip from '@app/shared/ui/Tooltip';
import CalendarCheckIcon from '@user/components/icons/CalendarCheckIcon';
import AlarmClockIcon from '@user/components/icons/AlarmClockIcon';
import FolderRootIcon from '@user/components/icons/FolderRoot';
import CurveIcon from '@user/components/icons/CurveIcon';
import Link from 'next/link';
import ChevronRightIcon from '@user/components/icons/ChevronRightIcon';
import BrainIcon from '@user/components/icons/BrainIcon'; // nuevo icono IA (debes tenerlo o crearlo)
import clsx from 'clsx';

const Sidebar = () => {
    /**
     * Secciones del sidebar con acciones IA.
     *
     */
    const sections = useMemo(
        () => [
            {
                id: crypto.randomUUID(),
                title: UserMessages.sidebar.options.myTime,
                icon: (
                    <AlarmClockIcon sizeStroke={1.8} size={20} className="" />
                ),
                links: [
                    {
                        id: crypto.randomUUID(),
                        href: '/',
                        label: 'Iniciar registro',
                    },
                    {
                        id: crypto.randomUUID(),
                        href: '/',
                        label: 'Iniciar registro 2',
                    },
                ],
                aiAction: 'Analizar y optimizar mi tiempo',
            },
            {
                id: crypto.randomUUID(),
                title: UserMessages.sidebar.options.tasks,
                icon: (
                    <CalendarCheckIcon
                        sizeStroke={1.8}
                        size={20}
                        className=""
                    />
                ),
                links: [],
                aiAction: 'Priorizar mis tareas con IA',
            },
            {
                id: crypto.randomUUID(),
                title: UserMessages.sidebar.options.proyects,
                icon: (
                    <FolderRootIcon sizeStroke={1.8} size={20} className="" />
                ),
                links: [],
                aiAction: 'Detectar riesgos del proyecto',
            },
            {
                id: crypto.randomUUID(),
                title: UserMessages.sidebar.options.reports,
                icon: <CurveIcon sizeStroke={1.8} size={20} className="" />,
                links: [
                    {
                        id: crypto.randomUUID(),
                        href: '/',
                        label: 'Iniciar registro',
                    },
                    {
                        id: crypto.randomUUID(),
                        href: '/',
                        label: 'Iniciar registro 2',
                    },
                ],
                aiAction: 'Generar análisis inteligente',
            },
        ],
        []
    );
    const sidebarRef = useRef(null);
    // Contexto del width sidebar
    const { setSidebarWidth } = useSidebarContext();
    const [width, setWidth] = useState(0);
    // Se debe cargar desde el contexto
    const { backgroundTheme } = useBackgroundThemeContext();
    const { userDTO } = useUserContext();

    // useEffect para obtener el ancho dinámico del sidebar.
    useEffect(() => {
        if (sidebarRef.current) {
            // Observamos los cambios de tamaño
            const observer = new ResizeObserver((values) => {
                for (let value of values) {
                    setWidth(value.contentRect.width);
                }
            });

            observer.observe(sidebarRef.current);
            return () => observer.disconnect();
        }
    }, []);

    // Se actualiza valor ancho del sidebar.
    useEffect(() => {
        setSidebarWidth(width);
    }, [width, setSidebarWidth]);

    const [hiddenSidebar, setHiddenSidebar] = useState(true);
    const [openSections, setOpenSections] = useState<number[]>([]);

    const onClickHandler = () => setHiddenSidebar((prev) => !prev);

    const toggleSection = (idx: number) => {
        setOpenSections((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    const handleAIAction = (action: string) => {
        console.log('Ejecutar IA:', action);
        // Aquí podrías abrir un modal o llamar a tu backend IA
    };

    /**
     * Deshabilita la opción si no tiene el rol
     * @returns
     */
    const isNotPermitted = (): boolean => {
        if (!userDTO) {
            return true;
        }
        return userDTO.state === UserStateEnum.INCOMPLETE_PERFIL;
    };

    /**
     * Clase para botón del
     */
    const classButtonSidebar = clsx(
        'group relative z-50 m-[0.4rem] mx-4 h-fit w-full max-w-[50px] cursor-pointer rounded-lg shadow-[0_10px_14px_rgba(0,0,0,0.18)] select-none hover:text-[#5280DA]',
        backgroundTheme
    );

    return (
        <div
            ref={sidebarRef}
            className={` ${isNotPermitted() && 'pointer-events-none opacity-50'} `}
        >
            {/* Botón superior */}
            <button
                onClick={onClickHandler}
                className={classButtonSidebar}
                disabled={isNotPermitted()}
            >
                {hiddenSidebar ? (
                    <div className="flex h-10 items-center justify-center px-4 hover:text-[#5280DA]">
                        <div>
                            <CloseSidebarIcon
                                className="cursor-pointer text-indigo-700"
                                sizeStroke={1.3}
                                size={28}
                            />
                            <Tooltip position="right" hiddenArrow>
                                Ocultar sidebar
                            </Tooltip>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-10 items-center justify-center rounded-t-lg rounded-b-lg px-4 py-1">
                        <div>
                            <SidebarIcon
                                //className="cursor-pointer text-indigo-700"
                                sizeStroke={0.3}
                                size={29}
                            />
                            <Tooltip position="right" hiddenArrow>
                                Abrir sidebar
                            </Tooltip>
                        </div>
                    </div>
                )}
            </button>

            {/* Contenido con animación. absolute z-50: suporpone / flotante */}
            <div
                className={`absolute z-50 mx-4 h-fit origin-top-left transform-gpu rounded-lg border-0 border-gray-300 bg-white shadow-[0_10px_14px_rgba(0,0,0,0.18)] transition-transform duration-200 ease-in-out select-none ${
                    hiddenSidebar
                        ? 'scale-100 opacity-100'
                        : 'scale-0 overflow-hidden opacity-0'
                }`}
            >
                {hiddenSidebar &&
                    sections.map((section, idx) => {
                        const isOpen = openSections.includes(idx);

                        return (
                            <div
                                key={section.id}
                                className="w-full max-w-[250px]"
                            >
                                {/* Icono de candado cuando se tienen los permisos.
                                Pendiente: componentizar, creadr hoook */}
                                {isNotPermitted() && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent">
                                        {/* Icono de candado o puntero bloqueado */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-8 w-8 text-gray-400"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3m-.75 0h10.5A1.5 1.5 0 0118 12v7.5A1.5 1.5 0 0116.5 21h-9A1.5 1.5 0 016 19.5V12a1.5 1.5 0 011.5-1.5z"
                                            />
                                        </svg>
                                    </div>
                                )}
                                {/* Título */}
                                <Text
                                    sizeOffset={3}
                                    className={`font-[410] tracking-tighter ${
                                        isOpen
                                            ? 'text-[#2D64D2]'
                                            : 'text-gray-600'
                                    } hover:text-[#5280DA]`}
                                    text={
                                        <button
                                            onClick={() => toggleSection(idx)}
                                            className={`flex w-full cursor-pointer items-center px-4 py-3 hover:bg-gray-100 ${
                                                isOpen && 'bg-gray-100'
                                            } ${idx == 0 ? 'hover: rounded-t-lg' : idx === sections.length - 1 && !isOpen && 'hover: rounded-b-lg'}`}
                                        >
                                            <div
                                                className={`mr-2 flex w-full items-center gap-2 group-hover:text-[#5280DA]`}
                                            >
                                                {section.icon}
                                                {section.title}
                                            </div>

                                            {section.links.length > 0 && (
                                                <ChevronRightIcon
                                                    className={`ml-auto transition-transform duration-200 group-hover:text-[#5280DA] ${
                                                        isOpen
                                                            ? 'rotate-90 ' +
                                                              'text-[#2D64D2]'
                                                            : 'text-gray-600'
                                                    }`}
                                                    size={18}
                                                    sizeStroke={2}
                                                />
                                            )}
                                        </button>
                                    }
                                />

                                {/* Links */}
                                {section.links.length > 0 && (
                                    <ul
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            isOpen
                                                ? 'max-h-40 opacity-100'
                                                : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        {section.links.map((link, i) => (
                                            <li
                                                key={link.id}
                                                className="w-full"
                                            >
                                                {/* Aplicar si se quita botón de I.A ${idx === sections.length - 1 && i === section.links.length - 1 && "hover:rounded-b-lg"} */}
                                                <Link
                                                    href={link.href}
                                                    className="block w-full px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
                                                >
                                                    <Text
                                                        text={link.label}
                                                        sizeOffset={0}
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Botón IA */}
                                {isOpen && section.aiAction && (
                                    <button
                                        onClick={() =>
                                            handleAIAction(section.aiAction)
                                        }
                                        className={` ${
                                            idx === sections.length - 1 &&
                                            'hover: rounded-b-lg'
                                        } flex w-full gap-2 px-4 py-2 text-xs text-violet-700 transition-colors hover:bg-violet-50`}
                                    >
                                        <BrainIcon sizeStroke={1.2} size={18} />
                                        {section.aiAction}
                                    </button>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Sidebar;
