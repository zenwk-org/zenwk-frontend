import { UserContext } from "@app/lib/providers/auth/UserContext";
import { useSafeConext } from "@app/shared/utils/UseContextUtils";

/**
 * @returns RegisterFlowContext
 */
export const useUserContext = () => {
    return useSafeConext(UserContext, "UserContext");
};
