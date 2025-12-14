import { useRouter } from "next/navigation";
import { useEffect, Dispatch, SetStateAction } from "react";

import { fetchValidateTokenApi } from "@/lib/shared/utils/fetchApi";

/**
 * Verifica la validez del token, UUID y correo electrónico proporcionados.
 * Si alguno no coincide, redirige al usuario al flujo de registro.
 *
 * @param email - Correo electrónico del usuario.
 * @param uuid - Identificador UUID asociado al token.
 * @param setLoading - Función para activar o desactivar el indicador de carga.
 */
const useRedirectRegister = (
    email: string,
    uuid: string,
    setLoading: Dispatch<SetStateAction<boolean>>,
    isResetPassword: boolean = false
) => {
    const router = useRouter();
    /**
     * useEffect del componente.
     */
    useEffect(() => {
        const validateToken = async () => {
            /**
             * Función para validar el flujo del registro.
             */
            try {
                if (email && uuid) {
                    const res = await fetchValidateTokenApi("", email, uuid);

                    if (!res) {
                        throw new Error("Invalid token response");
                    }
                } else {
                    throw new Error("Missing email or uuid");
                }
            } catch {
                if (isResetPassword) {
                    return router.push(`/login/forgot-password?email=${email}`);
                } else {
                    return router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);
};

export default useRedirectRegister;
