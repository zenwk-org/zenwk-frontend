import {
    ReactNode,
    createContext,
    useState,
    SetStateAction,
    Dispatch,
    useEffect,
    useMemo,
} from 'react';
import { Option } from '@/components/ui/inputs/SelectGeneral';
import { loadSexLabels } from '@/lib/shared/utils/genderOptionsUtils';
import { LOCAL_STORAGE_SEX_OPTIONS } from '@/lib/shared/constants/common-constants';

interface GenderOptionsContextType {
    optionsSex: Option[];
    setOptionsSex: Dispatch<SetStateAction<Option[]>>;
}

// Registro del contexto
export const GenderOptionsContext = createContext<
    GenderOptionsContextType | undefined
>(undefined);

/**
 * Crear el conexto para las opciones del sexo, y solo consultar una sola vez esta lista
 * @returns
 */
const GenderOptionsContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
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
        <GenderOptionsContext.Provider value={value}>
            {children}
        </GenderOptionsContext.Provider>
    );
};

export default GenderOptionsContextProvider;
