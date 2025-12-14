import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJwtBaseApi } from "@/lib/shared/utils/fetchApi";
import { getPerson } from "@/lib/modules/user/utils/personUtils";
import { usePersonContext } from "@/hooks/modules/user/usePersonContext";
import { useUserContext } from "@/hooks/modules/user/useUserContext";

export const useLoadUser = () => {
    const router = useRouter();

    const { userDTO, setUserDTO } = useUserContext();
    const { person, setPerson } = usePersonContext();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const pathUserMe = "/users/me";
                const userData = await fetchJwtBaseApi(
                    pathUserMe,
                    undefined,
                    undefined,
                    undefined,
                    "GET"
                );
                setUserDTO(userData);

                if (userData.idPerson) {
                    const personaData = await getPerson(userData.idPerson);
                    setPerson(personaData);
                }

                setAuthorized(true);
            } catch {
                router.push("/");
                setUserDTO(undefined);
                setAuthorized(false);
            }
        };

        loadUser();
    }, [router]);

    return {
        userDTO,
        person,
        authorized,
        setUserDTO,
        setPerson,
        setAuthorized,
    };
};
