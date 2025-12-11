import { PersonContext } from "@app/lib/providers/user/PersonContext";
import { useSafeConext } from "@app/shared/utils/UseContextUtils";

export const usePersonContext = () => {
    return useSafeConext(PersonContext, "PersonContext");
};
