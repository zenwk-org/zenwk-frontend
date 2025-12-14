/**
 * Valida que un string no seal null. si es nulo returna un string vacio.
 * @param value
 * @returns
 */
export const safeValue = (value?: string) => {
    if (
        value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "string" && value.trim().toLowerCase() === "null")
    ) {
        return "";
    }
    return value;
};

/**
 * Obtiene las inciales del nombre cuando el  usuario no ha cargado una foto de perfil.
 *
 * @param firstName
 * @param lastName
 * @returns
 */
export function getInitials(firstName: string, lastName: string) {
    // Validamos que sean strings y no estén vacíos
    if (typeof firstName !== "string" || typeof lastName !== "string") {
        throw new TypeError("Los parámetros deben ser cadenas de texto");
    }

    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();

    if (!cleanFirst || !cleanLast) {
        throw new Error("Los parámetros no pueden estar vacíos");
    }

    // Tomamos la primera letra y la convertimos a mayúscula
    const initials =
        cleanFirst.charAt(0).toUpperCase() +
        "." +
        cleanLast.charAt(0).toUpperCase() +
        ".";

    return initials;
}
