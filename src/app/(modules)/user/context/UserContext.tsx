'use client';
import { UserDTO } from '@user/types/user-dto';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useMemo,
} from 'react';

interface UserContextType {
    userDTO: UserDTO | undefined;
    setUserDTO: Dispatch<SetStateAction<UserDTO | undefined>>;
}

// Registro del contexto
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

/**
 *  Crea el contexto para la sesión del usuario.
 * @param children
 * @returns
 */
const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [userDTO, setUserDTO] = useState<UserDTO>();
    // Memoriza el objeto de contexto para evitar re-renderes innecesarios
    const value = useMemo(() => ({ userDTO, setUserDTO }), [userDTO]);
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    );
};

export default UserContextProvider;
