import { RegisterOptions } from "react-hook-form";
import {
    isApiFieldErrorArray,
    isClientErrorMessage,
} from "@app/helpers/fetch-api";

/**
 * Define y retorna un conjunto de validaciones comunes para formularios de autenticación,
 * incluyendo validación de email, contraseña, longitud mínima y comparación de contraseñas.
 */
export const formValidate = () => {
    const requiredEmail = "Ingresa una dirección de correo.";
    const requiredPassword = "Ingresa una contraseña.";

    const patternEmail: RegisterOptions["pattern"] = {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        message: "Formato de correo incorrecto",
    };

    const patternPassword: RegisterOptions["pattern"] = {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]:;"'<>,.?/~\\|]).{8,}$/,
        message: "INVALID_PASSWORD",
    };

    const minLength: RegisterOptions["minLength"] = {
        value: 6,
        message: "Mínimo 6 carácteres.",
    };

    const validateTrim: RegisterOptions["validate"] = {
        trim: (v: string) => {
            if (!v.trim()) {
                return "Espacios ingresados.";
            }
            return true;
        },
    };

    const validateEquals = (
        value: string,
        messageError: string
    ): RegisterOptions["validate"] => ({
        equals: (v: string) => v === value || messageError,
    });

    // Retorna todas las validaciones disponibles para usar en los formularios
    return {
        requiredEmail, // Mensaje requerido para email vacío
        requiredPassword, // Mensaje requerido para contraseña vacía
        patternEmail, // Patrón de validación de formato de email
        patternPassword, // Patrón de validación de fortaleza de contraseña
        minLength, // Validación de longitud mínima
        validateTrim, // Validación que evita espacios vacíos
        validateEquals, // Validación para comprobar igualdad entre contraseñas
    };
};

/**
 * Manejo de error generado por el api.
 *
 * @param error
 * @param setErrorBack
 * @param safeValue
 */
export const handleApiErrors = (
    error: unknown,
    setErrorBack: (msg: string) => void,
    safeValue: (v: any) => string | undefined
) => {
    if (isApiFieldErrorArray(error)) {
        const errors = error
            .map(
                (err) =>
                    `Campo: ${safeValue(err.field)}. ${safeValue(err.code)} ${safeValue(
                        err.error
                    )}`
            )
            .join("\n");
        setErrorBack(errors);
    } else if (isClientErrorMessage(error)) {
        setErrorBack(error.message);
    } else {
        setErrorBack(String(error));
    }
};
