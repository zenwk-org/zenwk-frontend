import { fetchJwtBaseApi } from "@app/helpers/fetch-api";
import { User } from "@app/app/(modules)/user/context/JwtContext-eliminar";

/**
 * Realiza el login contra la API de autenticación.
 * @param data - Datos de acceso del usuario.
 * @returns Token JWT y datos de usuario si son válidos.
 */
export const loginApi = async (
    email: string,
    password: string
): Promise<{ token: string; userId: number }> => {
    const path = "/auth/login";
    const body = { username: email, password };

    try {
        const res = await fetchJwtBaseApi(
            path,
            undefined,
            undefined,
            body,
            "POST"
        );

        return res;
    } catch (error) {
        throw error;
    }
};

/**
 * Valida si un jwt esta vigente, si lo esta devuelve el userDTO (backend)
 * @param userData
 * @returns
 */
export const fetchGetUser = async (userData: User) => {
    try {
        const pathFindByIdUser = `/users/${userData.userId}`;
        const res = await fetchJwtBaseApi(
            pathFindByIdUser,
            undefined,
            userData.jwt,
            undefined,
            "GET"
        );
        return res;
    } catch (error) {
        throw error;
    }
};
/**
 *  Refresca el jwt. Útil cuando se asigna un nuevo rol dentro la misma sesión de ese  usuario.
 * Uso para roles automáticos. Otro rol dado por administrador  es neceario el cierre e inicio de sesión.
 * @param jwt
 * @returns
 */
export const refreshAuthJwt = async (jwt: string): Promise<String> => {
    try {
        const pathRefreshAuthJwt = `/users/auth/refresh-jwt`;
        const res = await fetchJwtBaseApi(
            pathRefreshAuthJwt,
            undefined,
            jwt,
            undefined,
            "GET"
        );
        return res;
    } catch (error) {
        throw error;
    }
};
