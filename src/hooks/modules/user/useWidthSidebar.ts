import { WidthSidebarContext } from "@app/lib/providers/width-sidebar-context";
import { useSafeConext } from "@app/shared/utils/UseContextUtils";

/**
 * Exporta el contexto  del el ancho del sidebar para
 * poder aplicar cambios dinámicos en los etilos css.
 * @returns RegisterFlowContext
 */
export const useSidebarContext = () => {
    return useSafeConext(WidthSidebarContext, "WidthSidebarContext");
};
