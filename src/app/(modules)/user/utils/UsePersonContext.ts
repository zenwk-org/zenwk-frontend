import { PersonContext } from '@app/app/(modules)/user/context/PersonContext';
import { useSafeConext } from "@app/shared/utils/UseContextUtils";

export const usePersonContext = () => {
    return useSafeConext(PersonContext, "PersonContext");
};
