import { getTokenUrl, getBaseUrl } from "./api-helper";
import {
    BackendErrorResponse,
    ClientErrorMessage,
} from "@app/shared/interfaces/auth";
import qs from "qs";

/**
 * Interface que representa el objeto que retorna el back cuando se presenta un error en el DTO el api create person.
 */
export interface ApiFieldError {
    field: string;
    code: string;
    error: string;
}

/**
 * Tipo para manejar los errores del Back por validaciones del DTO
 */
export type BadRequestErrorResponse = ApiFieldError[] | string;

/**
 * Valida si el error es del tipo ApiFieldError
 * @param data
 * @returns
 */
export const isApiFieldErrorArray = (
    data: unknown
): data is ApiFieldError[] => {
    return (
        Array.isArray(data) &&
        data.every(
            (item) =>
                typeof item.field === "string" &&
                typeof item.code === "string" &&
                (typeof item.error === "string" || item.error === null)
        )
    );
};

// Sonar. Validación genérica
const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// Validador específico para Backend
function isBackendErrorResponse(error: unknown): error is BackendErrorResponse {
    return (
        isObject(error) &&
        "code" in error &&
        "message" in error &&
        typeof error.message === "string"
    );
}

// Validador específico para ClientError
export function isClientErrorMessage(
    error: unknown
): error is ClientErrorMessage {
    return (
        isObject(error) &&
        "title" in error &&
        "message" in error &&
        typeof error.message === "string"
    );
}

/**
 * Construye y retorna un objeto de configuración para `fetch` con headers, método y body.
 *
 * @param methodHttp - Método HTTP (GET, POST, etc.).
 * @param tokenJwt - Token JWT opcional para autenticación.
 * @param body - Objeto JSON / FormData que se incluirá como cuerpo de la solicitud.
 * @returns Opciones para el método `fetch`.
 */
export const getMergedOptions = (
    methodHttp: string,
    tokenJwt?: string,
    body?: object | FormData
) => {
    const headers: Record<string, string> = {};
    let optionsBody: BodyInit | undefined;

    if (tokenJwt) {
        headers["Authorization"] = `Bearer ${tokenJwt}`;
    }

    if (body instanceof FormData) {
        // Navegador setea header:
        // ["content-type"] = "multipart/form-data"
        optionsBody = body;
    } else if (body && Object.keys(body).length > 0) {
        headers["content-type"] = "application/json";
        optionsBody = JSON.stringify(body);
    }

    // Token CSRF (obtenido de la cookie set por el backend)
    const csrfToken = getCookieValue("XSRF-TOKEN");
    if (csrfToken) {
        headers["X-XSRF-TOKEN"] = csrfToken;
    }

    // Se agrega cookie token csrf a todas las peticiones
    const options: RequestInit & { next?: { revalidate: number } } = {
        next: { revalidate: 60 },
        method: methodHttp,
        headers,
        body: optionsBody,
        credentials: "include",
    };

    return options;
};

/**
 * Extrae el valor de una cookie por nombre.
 *
 * @param name - Nombre de la cookie.
 * @returns Valor de la cookie o `null` si no existe.
 */
function getCookieValue(name: string): string | null {
    if (typeof document === "undefined") return null; // no hay cookies en SSR

    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = regex.exec(document.cookie);

    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Construye una URL relativa con su query string (si aplica) bajo el prefijo `/api`.
 *
 * @param queryString - Cadena de parámetros en formato URL.
 * @param path - Ruta base.
 * @returns URL relativa combinada.
 */
export const getUrl = (queryString: string, path: string) => {
    let url = "/api" + path;

    if (queryString) {
        url += "?" + queryString;
    }
    return url;
};

/**
 * Convierte un objeto de parámetros en un query string.
 *
 * @param queryParams - Objeto con claves y valores de parámetros.
 * @returns Query string codificado.
 */
export const getQueryString = (queryParams?: Record<string, string>) => {
    return qs.stringify(queryParams, { encodeValuesOnly: true });
};

/**
 * Realiza una petición `fetch` y maneja errores funcionales y técnicos definidos por el backend.
 *
 * @param requestUrl - URL completa a consumir.
 * @param mergedOptions - Configuración de la solicitud.
 * @returns Respuesta procesada o error.
 */
export const getFetch = async (
    requestUrl: string,
    mergedOptions: RequestInit & { next?: { revalidate: number } }
) => {
    try {
        const res = await fetch(requestUrl, mergedOptions);

        switch (res.status) {
            case 201:
                return res; // acceso a location

            case 204:
                return true;

            case 400: {
                const response = await res.json();
                if (isApiFieldErrorArray(response)) {
                    throw response; // ya es un objeto
                }
                throw new Error("400 (Bad request)");
            }

            case 403:
            case 404:
            case 500: {
                const response = await res.json();
                throw new Error(
                    JSON.stringify({
                        code: response.code,
                        message: response.error,
                    })
                );
            }

            default:
                return await res.json();
        }
    } catch (error: unknown) {
        throw error; // aquí es correcto no modificar el error capturado
    }
};
/**
 * Genera un token asociado al email del usuario.
 *
 * @param correo - Email del usuario.
 * @returns Respuesta del backend o error.
 */
export const fetchTokenApi = async (correo: string) => {
    const path = "/verification/token/send";
    try {
        const queryString = getQueryString();
        const mergedOptions = getMergedOptions("POST", undefined, {
            email: correo,
        });

        const requestUrl = `${getTokenUrl(getUrl(queryString, path))}`;
        return await getFetch(requestUrl, mergedOptions);
    } catch (error: unknown) {
        throw new Error(error as string);
    }
};

/**
 * Valida un token enviado al usuario.
 *
 * @param code - Código de verificación.
 * @param email - Email del usuario.
 * @param uuid - Identificador único de la sesión.
 * @returns Respuesta del backend o error.
 */
export const fetchValidateTokenApi = async (
    code: string,
    email: string,
    uuid: string
) => {
    try {
        const path = "/verification/token/validate";

        const mergedOptions = getMergedOptions("POST", undefined, {
            code,
            email,
            uuid,
        });
        const queryString = getQueryString();
        const requestUrl = `${getTokenUrl(getUrl(queryString, path))}`;
        const data = await getFetch(requestUrl, mergedOptions);
        return data;
    } catch (error: unknown) {
        throw new Error(JSON.stringify(error));
    }
};

/**
 * Utilidad para realizar el consumo de APIs expuestas en el stack `security-zenwk`.
 *
 * @param path - Recurso REST expuesto.
 * @param urlParamObjects - Parámetros de la URL (query params).
 * @param tokenJwt - Token JWT.
 * @param bodyJson - Cuerpo de la solicitud.
 * @param methodHttp - Método HTTP.
 * @returns Respuesta del backend o error.
 */
export const fetchJwtBaseApi = async (
    path: string,
    urlParamObjects?: Record<string, string>,
    tokenJwt = "",
    bodyJson?: {},
    methodHttp = ""
) => {
    try {
        const mergedOptions = getMergedOptions(methodHttp, tokenJwt, bodyJson);
        const queryString = getQueryString(urlParamObjects);
        const requestUrl = `${getBaseUrl(getUrl(queryString, path))}`;
        const data = await getFetch(requestUrl, mergedOptions);
        return data;
    } catch (error: unknown) {
        throw new Error(JSON.stringify(error));
    }
};

/**
 * Utilidad para consumir APIs expuestas en el stack `verification-zenwk`.
 *
 * @param path - Recurso REST expuesto.
 * @param urlParamObjects - Parámetros de la URL (query params).
 * @param bodyJson - Cuerpo de la solicitud.
 * @param methodHttp - Método HTTP.
 * @returns Respuesta del backend o error.
 */
export const fetchVerifcation = async (
    path: string,
    urlParamObjects?: Record<string, string>,
    bodyJson?: {},
    methodHttp = ""
) => {
    try {
        const mergedOptions = getMergedOptions(methodHttp, undefined, bodyJson);
        const queryString = getQueryString(urlParamObjects);
        const requestUrl = `${getTokenUrl(getUrl(queryString, path))}`;

        const data = await getFetch(requestUrl, mergedOptions);
        return data;
    } catch (error: unknown) {
        throw new Error(JSON.stringify(error));
    }
};

/**
 * Verifica si un correo ya se encuentra registrado en el sistema.
 *
 * @param email - Correo a validar.
 * @returns `true` si ya está registrado, `false` si no.
 */
export const fetchValidateRegisterEmail = async (email: string) => {
    try {
        const path = "/users/email/" + email;
        return await fetchJwtBaseApi(
            path,
            undefined,
            undefined,
            undefined,
            "GET"
        );
    } catch (error: unknown) {
        if (isBackendErrorResponse(error)) {
            return true;
        }
    }
};

/**
 * Obtiene la URL base del sitio, adaptándose automáticamente
 * al entorno (cliente o servidor).
 *
 * @returns URL base del sitio (ej. https://zenwk.com).
 */
export const getUrlServer = (): string => {
    if (typeof globalThis !== "undefined" && globalThis.location) {
        return `${globalThis.location.protocol}//${globalThis.location.host}`;
    }
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};
/**
 * Genera un token crsf asociado al email del usuario.
 * Hasta ahora no se usa. Solo  nivel interno del backen httponly
 *
 * @param correo - Email del usuario.
 * @returns Respuesta del backend o error.
 */
export const fetchTokenCrsfApi = async (correo: string) => {
    const path = "/verification/csrf/token";

    try {
        const queryString = getQueryString();
        const mergedOptions = getMergedOptions("POST", undefined, {
            email: correo,
        });

        const requestUrl = `${getTokenUrl(getUrl(queryString, path))}`;

        // Registro del la cookie httpOnly
        await getFetch(requestUrl, mergedOptions);
    } catch (error: unknown) {
        throw new Error(error as string);
    }
};

/**
 * Genera un token crsf asociado al email del usuario.
 * Hasta ahora no se usa. Solo  nivel interno del backen httponly
 *
 * @param correo - Email del usuario.
 * @param codeToken - Token CRSF.
 * @returns Respuesta del backend o error.
 */
export const fetchValidateTokenCrsfApi = async (
    correo: string,
    codeToken: string
) => {
    const path = "/verification/csrf/token/validate";
    try {
        const queryString = getQueryString();
        const mergedOptions = getMergedOptions("POST", undefined, {
            email: correo,
            code: codeToken,
        });

        const requestUrl = `${getTokenUrl(getUrl(queryString, path))}`;
        return await getFetch(requestUrl, mergedOptions);
    } catch (error: unknown) {
        throw new Error(error as string);
    }
};
