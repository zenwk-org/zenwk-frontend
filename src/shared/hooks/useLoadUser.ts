import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJwtBaseApi } from "@app/helpers/fetch-api";
import { getPerson } from "@user/utils/personUtils";
import { usePersonContext } from "@user/utils/UsePersonContext";
import { useUserContext } from "@user/utils/UseUserContext";

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
