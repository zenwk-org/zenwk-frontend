import { useSafeConext } from "@app/shared/utils/UseContextUtils";
import { BackgroundThemeContext } from "@app/lib/providers/theme/BackgroundThemeContext";

/**
 * Se utiliza para obtener el contexto
 * @returns
 */
export const useBackgroundThemeContext = () => {
    return useSafeConext(BackgroundThemeContext, "BackgroundThemeContext");
};
