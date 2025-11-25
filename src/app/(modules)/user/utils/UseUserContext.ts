import { UserContext } from "@user/context/UserContext";
import { useSafeConext } from "@app/shared/utils/UseContextUtils";

/**
 * @returns RegisterFlowContext
 */
export const useUserContext = () => {
    return useSafeConext(UserContext, "UserContext");
};
