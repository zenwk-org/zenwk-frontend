import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

/**
 * Representa los campos utilizados en el formulario de cambio o creación de contraseña (set-password).
 */
export interface SetPassword {
    password: string;
    repassword: string;
}

/**
 * Representa los campos requeridos para iniciar sesión en el sistema.
 */
export interface LoginForm {
    email: string;
    password: string;
}

/**
 * Define la estructura del error recibido desde el backend,
 * incluyendo un código, el mensaje de error y una marca de tiempo.
 */
export interface BackendErrorResponse {
    code: string;
    error: string;
    timestamp: Timestamp;
}
