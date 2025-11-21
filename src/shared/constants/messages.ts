import { error } from "console";

/**
 * Errores y mensajes comunes reutilizables en toda la aplicación.
 */
export const Messages = {
    commons: {
        // Proveedores de correo utilizados comúnmente
        gmail: "Gmail",
        outlook: "Outlook",
        iCloud: "iCloud",

        // Texto genérico reutilizable
        literalTexts: {
            here: " aquí.",
            confirmReturn: (errorMessage?: string) =>
                `${errorMessage?.trim() || ""} ¿Desea volver al `,
            register: "registro?",
            options: "opcs. ",
        },
    },
    placeholder: {
        // Ejemplo de email para usar como placeholder en formularios
        emailExample: "name@your-email.com",
        password: "Ingresa tu contraseña",
    },
};
