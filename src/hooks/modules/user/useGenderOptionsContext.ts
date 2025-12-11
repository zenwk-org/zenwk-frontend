import { SexOptionsContext } from "@app/app/(dashboard)/user/context/SexOptionsContext";
import { useSafeConext } from "@app/shared/utils/UseContextUtils";
/**
 * Exporta el contexto para RegisterFlowContext.
 * @returns RegisterFlowContext
 */
export const useGenderOptionsContext = () => {
    return useSafeConext(SexOptionsContext, "SexOptionsContext");
};
