import { WidthSidebarContext } from "@user/context/WidthSidebarContext";
import { useSafeConext } from "@app/shared/utils/useContextUtils";

/**
 * Exporta el contexto  del el ancho del sidebar para
 * poder aplicar cambios dinámicos en los etilos css.
 * @returns RegisterFlowContext
 */
export const useSidebarContext = () => {
    return useSafeConext(WidthSidebarContext, "WidthSidebarContext");
};
