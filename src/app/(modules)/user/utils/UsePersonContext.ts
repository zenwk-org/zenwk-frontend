import { PersonContext } from "@user/context/PersonContext";
import { useSafeConext } from "@app/shared/utils/useContextUtils";

export const usePersonContext = () => {
    return useSafeConext(PersonContext, "PersonContext");
};
