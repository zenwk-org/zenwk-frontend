'use client';
import { UserDTO } from '@app/app/(modules)/user/types/user-dto';

import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
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

    return (
        <UserContext.Provider value={{ userDTO, setUserDTO }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
