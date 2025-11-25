'use client';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useMemo,
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
    // Memoriza el objeto de contexto para evitar re-renderes innecesarios
    const value = useMemo(
        () => ({ sidebarWidth, setSidebarWidth }),
        [sidebarWidth]
    );

    return (
        <WidthSidebarContext.Provider value={value}>
            {children}
        </WidthSidebarContext.Provider>
    );
};

export default WidthSidebarContextProvider;
