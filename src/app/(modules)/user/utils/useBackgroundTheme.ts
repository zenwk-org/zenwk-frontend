import { useSafeConext } from "@app/shared/utils/useContextUtils";
import { BackgroundThemeContext } from "../context/BackgroundThemeContext";

/**
 * Se utiliza para obtener el contexto
 * @returns
 */
export const useBackgroundThemeContext = () => {
    return useSafeConext(BackgroundThemeContext, "BackgroundThemeContext");
};
