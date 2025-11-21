'use client';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
} from 'react';

interface WidthSidebarContextType {
    sidebarWidth: number;
    setSidebarWidth: Dispatch<SetStateAction<number>>;
}

// Registro del contexto
export const WidthSidebarContext = createContext<
    WidthSidebarContextType | undefined
>(undefined);

/**
 *  Crea el contexto para la sesión del usuario.
 * @param children
 * @returns
 */
const WidthSidebarContextProvider = ({ children }: { children: ReactNode }) => {
    const [sidebarWidth, setSidebarWidth] = useState<number>(0);

    return (
        <WidthSidebarContext.Provider value={{ sidebarWidth, setSidebarWidth }}>
            {children}
        </WidthSidebarContext.Provider>
    );
};

export default WidthSidebarContextProvider;
