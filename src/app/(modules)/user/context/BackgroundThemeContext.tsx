'use cliente';

import {
    createContext,
    ReactNode,
    useState,
    SetStateAction,
    Dispatch,
    useMemo,
} from 'react';

/**
 * Interface
 */
interface PersonContextType {
    backgroundTheme: string | undefined;
    setBackgroundTheme: Dispatch<SetStateAction<string | undefined>>;
}

/**
 * Registro en el contexto
 */

export const BackgroundThemeContext = createContext<
    PersonContextType | undefined
>(undefined);

/**
 * Exporta proveedor del contexto
 * @param param0
 * @returns
 */
export const BackgroundThemeContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [backgroundTheme, setBackgroundTheme] = useState<string>();
    // Memoriza el objeto de contexto para evitar re-renderes innecesarios
    const value = useMemo(
        () => ({ backgroundTheme, setBackgroundTheme }),
        [backgroundTheme]
    );

    return (
        <BackgroundThemeContext.Provider value={value}>
            {children}
        </BackgroundThemeContext.Provider>
    );
};

export default BackgroundThemeContextProvider;
