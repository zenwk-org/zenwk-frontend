'use client';
import { PersonDTO } from '@/lib/modules/user/types/person-dto';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useMemo,
} from 'react';

interface PersonContextType {
    person: PersonDTO | undefined;
    setPerson: Dispatch<SetStateAction<PersonDTO | undefined>>;
}

// Registro del contexto
export const PersonContext = createContext<PersonContextType | undefined>(
    undefined
);

/**
 *  Crea el contexto para la sesión del usuario.
 * @param children
 * @returns
 */
const PersonContextProvider = ({ children }: { children: ReactNode }) => {
    const [person, setPerson] = useState<PersonDTO>();

    // Memoriza el objeto de contexto para evitar re-renderes innecesarios
    const value = useMemo(() => ({ person, setPerson }), [person]);
    return (
        <PersonContext.Provider value={value}>
            {children}
        </PersonContext.Provider>
    );
};

export default PersonContextProvider;
