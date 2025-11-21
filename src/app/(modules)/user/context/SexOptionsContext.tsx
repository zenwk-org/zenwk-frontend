import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useEffect,
} from 'react';
import { Option } from '@user/ui/inputs/SelectGeneral';
import { loadSexLabels } from '@app/shared/utils/optionsSexUtils';
import { LOCAL_STORAGE_SEX_OPTIONS } from '@app/shared/constants/common-constants';

interface SexOptionsContextType {
    optionsSex: Option[];
    setOptionsSex: Dispatch<SetStateAction<Option[]>>;
}

// Registro del contexto
export const SexOptionsContext = createContext<
    SexOptionsContextType | undefined
>(undefined);

/**
 * Crear el conexto para las opciones del sexo, y solo consultar una sola vez esta lista
 * @returns
 */
const SexOptionsContextProvider = ({ children }: { children: ReactNode }) => {
    const [optionsSex, setOptionsSex] = useState<Option[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const cached = localStorage.getItem(LOCAL_STORAGE_SEX_OPTIONS);
                if (cached) {
                    setOptionsSex(JSON.parse(cached));
                } else {
                    const options: Option[] = await loadSexLabels(); // trae los objetos completos
                    localStorage.setItem(
                        LOCAL_STORAGE_SEX_OPTIONS,
                        JSON.stringify(options)
                    );
                    setOptionsSex(options);
                }
            } catch (error) {}
        };

        fetchOptions();
    }, []);

    return (
        <SexOptionsContext.Provider value={{ optionsSex, setOptionsSex }}>
            {children}
        </SexOptionsContext.Provider>
    );
};

export default SexOptionsContextProvider;
