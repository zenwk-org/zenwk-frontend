import { useSafeConext } from "@/hooks/shared/useContextUtils";
import { BackgroundThemeContext } from "@/lib/providers/theme/BackgroundThemeContext";

/**
 * Se utiliza para obtener el contexto
 * @returns
 */
export const useBackgroundThemeContext = () => {
    return useSafeConext(BackgroundThemeContext, "BackgroundThemeContext");
};
