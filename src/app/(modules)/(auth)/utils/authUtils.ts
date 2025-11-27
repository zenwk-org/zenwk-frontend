import { fetchJwtBaseApi } from "@app/helpers/fetch-api";

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

    return await fetchJwtBaseApi(path, undefined, undefined, body, "POST");
};

/**
 *  Refresca el jwt. Útil cuando se asigna un nuevo rol dentro la misma sesión de ese  usuario.
 * Uso para roles automáticos. Otro rol dado por administrador  es neceario el cierre e inicio de sesión.
 * @param jwt
 * @returns
 */
export const refreshAuthJwt = async (jwt: string): Promise<string> => {
    const pathRefreshAuthJwt = `/users/auth/refresh-jwt`;
    return await fetchJwtBaseApi(
        pathRefreshAuthJwt,
        undefined,
        jwt,
        undefined,
        "GET"
    );
};

/**
 * Politicas de contraseñas
 */
export const politiciesPassword = [
    { id: "min_length", rule: "Mínimo 8 caracteres" },
    { id: "uppercase", rule: "Una mayúscula" },
    { id: "lowercase", rule: "Una minúscula" },
    { id: "number", rule: "Un número" },
    { id: "special_char", rule: "Un carácter especial" },
];
