"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJwtBaseApi } from "@/lib/shared/utils/fetchApi";
import { useUserContext } from "@/hooks/modules/user/useUserContext";
import { usePersonContext } from "@/hooks/modules/user/usePersonContext";

/**
 * Hook que encapsula la lógica de cierre de sesión del usuario.
 * Gestiona animaciones, limpieza de contexto y redirección.
 */
export const useLogout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUserDTO } = useUserContext();
    const { setPerson } = usePersonContext();

    /**
     * Ejecuta el proceso completo de logout:
     *  - Llama a la API /auth/logout
     *  - Limpia los contextos globales de usuario y persona
     *  - Redirige al login con un pequeño retardo para animación
     */
    const handleLogout = async () => {
        try {
            setIsLoading(true);

            const path = "/auth/logout";
            await fetchJwtBaseApi(
                path,
                undefined,
                undefined,
                undefined,
                "DELETE"
            );
        } catch (error) {
            console.error("Error durante el logout:", error);
        } finally {
            // Espera breve para animación o UX
            await new Promise((resolve) => setTimeout(resolve, 300));
            setIsLoading(false);
            // Limpieza de contexto
            setUserDTO(undefined);
            setPerson(undefined);
            router.push("/");
        }
    };

    return { handleLogout, isLoading };
};
