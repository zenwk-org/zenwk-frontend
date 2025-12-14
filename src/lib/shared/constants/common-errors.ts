/**
 * Errores comunes en la aplicación
 */
export const CommonsErros = {
    unknown: (message: string) => `Error desconocido en: ${message} `,
    unknownCode: "[unknown]",
    codeExpired: "El código ha expirado. Solicita uno nuevo.",
    invalidCode: "El código ingresado no es válido.",
};
