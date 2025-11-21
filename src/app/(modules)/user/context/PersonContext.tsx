'use client';
import { PersonDTO } from '@user/types/person-dto';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
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
    return (
        <PersonContext.Provider value={{ person, setPerson }}>
            {children}
        </PersonContext.Provider>
    );
};

export default PersonContextProvider;
