import { WidthSidebarContext } from "@/lib/providers/theme/WidthSidebarContext";
import { useSafeConext } from "@/hooks/shared/useContextUtils";

/**
 * Exporta el contexto  del el ancho del sidebar para
 * poder aplicar cambios dinámicos en los etilos css.
 * @returns RegisterFlowContext
 */
export const useSidebarContext = () => {
    return useSafeConext(WidthSidebarContext, "WidthSidebarContext");
};
