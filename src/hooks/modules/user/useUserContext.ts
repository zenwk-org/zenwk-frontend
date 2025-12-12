import { UserContext } from "@/lib/providers/auth/UserContext";
import { useSafeConext } from "@/hooks/shared/useContextUtils";

/**
 * @returns RegisterFlowContext
 */
export const useUserContext = () => {
    return useSafeConext(UserContext, "UserContext");
};
