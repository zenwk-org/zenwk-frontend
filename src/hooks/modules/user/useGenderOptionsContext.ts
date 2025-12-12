import { GenderOptionsContext } from "@/lib/providers/user/GenderOptionsContext";
import { useSafeConext } from "@/hooks/shared/useContextUtils";
/**
 * Exporta el contexto para RegisterFlowContext.
 * @returns RegisterFlowContext
 */
export const useGenderOptionsContext = () => {
    return useSafeConext(GenderOptionsContext, "GenderOptionsContext");
};
