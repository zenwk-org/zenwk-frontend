import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useEffect,
    useMemo,
} from 'react';
import { Option } from '@app/app/(dashboard)/user/ui/inputs/SelectGeneral';
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
    // Memoriza el objeto de contexto para evitar re-renderes innecesarios
    const value = useMemo(() => ({ optionsSex, setOptionsSex }), [optionsSex]);

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
            } catch {}
        };

        fetchOptions();
    }, []);

    return (
        <SexOptionsContext.Provider value={value}>
            {children}
        </SexOptionsContext.Provider>
    );
};

export default SexOptionsContextProvider;
