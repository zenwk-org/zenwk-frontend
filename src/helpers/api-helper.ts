/**
 * Concatena el path al endpoint base para la generación del token de autenticación.
 * Utiliza la variable de entorno `API_AUTH_TOKEN_DEV_PUBLIC_URL` si está definida; de lo contrario, usa la URL por defecto.
 *
 * @param path - Ruta adicional a concatenar (opcional).
 * @returns URL completa del servicio de autenticación.
 */
export const getTokenUrl = (path = "") => {
    return `${
        process.env.API_AUTH_TOKEN_DEV_PUBLIC_URL || "https://localhost:6601"
    }${path}`;
};

/**
 * Concatena el path a la URL base pública del sistema.
 * Utiliza la variable de entorno `API_BASE_DEV_PUBLIC_URL` si está definida; de lo contrario, usa la URL por defecto.
 *
 * @param path - Ruta adicional a concatenar (opcional).
 * @returns URL completa del backend público.
 */
export const getBaseUrl = (path = "") => {
    return `${
        process.env.API_BASE_DEV_PUBLIC_URL || "https://localhost:6601"
    }${path}`;
};
