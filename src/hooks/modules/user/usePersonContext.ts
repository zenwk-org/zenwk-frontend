import { PersonContext } from "@/lib/providers/user/PersonContext";
import { useSafeConext } from "@/hooks/shared/useContextUtils";

export const usePersonContext = () => {
    return useSafeConext(PersonContext, "PersonContext");
};
