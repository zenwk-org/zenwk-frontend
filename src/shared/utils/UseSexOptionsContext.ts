import { SexOptionsContext } from '@app/app/(modules)/user/context/SexOptionsContext';
import { useSafeConext } from "@app/shared/utils/UseContextUtils";
/**
 * Exporta el contexto para RegisterFlowContext.
 * @returns RegisterFlowContext
 */
export const useSexOptionsContext = () => {
    return useSafeConext(SexOptionsContext, "SexOptionsContext");
};
