import { SexOptionsContext } from "@user/context/SexOptionsContext";
import { useSafeConext } from "./UseContextUtils";
/**
 * Exporta el contexto para RegisterFlowContext.
 * @returns RegisterFlowContext
 */
export const useSexOptionsContext = () => {
    return useSafeConext(SexOptionsContext, "SexOptionsContext");
};
