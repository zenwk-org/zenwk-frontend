/**
 * Mensajes usados en el módulo de usuarios.
 */
export const UserMessages = {
    welcome: {
        title: "Hola ",
        subtitle:
            ", gracias por estar aquí. Que tu jornada transcurra con enfoque y serenidad.",
        completeRegister:
            "¡Completa tu registro, ya casi estás listo para empezar! ",

        successMessage:
            "Tus datos personales se han actualizado correctamente. ¡Gracias por mantener tu información al día!",
    },
    formComplete: {
        age: { placeholder: "Seleccionar", labelOption: "Edad" },
        sex: { placeholder: "Seleccionar", labelOption: "Sexo" },
        labels: {
            firstName: "Primer nombre",
            middleName: "Segundo nombre",
            lastName: "Primer apellido",
            middleLastName: "Segundo apellido",
            sex: "Sexo",
            age: "Edad",
            names: "Nombres",
            surnames: "Apellidos",
            dateOfBirth: "Fecha de nacimiento",
        },
        placeholder: {
            firstName: "Primer nombre",
            middleName: "Segundo nombre",
            lastName: "Primer apellido",
            middleLastName: "Segundo apellido",
            dateOfBirth: "No registrado",
        },
    },
    buttons: {
        welcome: {
            buttonSave: "Guardar información personal",
        },
        save: "Guardar",
        back: "Atrás",
        updatePersonalInfo: "Actualizar información personal",
        deleteAccount: "Eliminar cuenta ",
    },
    messageToolTip: {
        closeWindow: "Lo haré después",
        start: "inicio",
        back: "Volver",
    },
    header: {
        userMenu: {
            profile: "Perfil",
            config: "Ajustes",
            logout: "Cerrar sesión",
            out: "Salir",
            company: "My Company",
        },
        logo: {
            zUpperCase: "Z",
            enwk: "enwk",
        },
    },
    footer: {
        conditions: " Términos y condiciones",
        policies: "Política de privacidad",
        copyrigth:
            "Copyright © 2025 Alineumsoft™. Todos los derechos reservados.",
    },
    sidebar: {
        options: {
            myTime: "Mi tiempo",
            pomodoro: " - Pomodoro",
            ultradian: " - Ultradian",
            flowtime: " - Flowtime",
            tasks: "Tareas",
            proyects: "Proyectos",
            reports: "Análisis y Reportes",
        },
    },
    profileConfiguration: {
        header: {
            title: "Configuración de Perfil",
        },
        sections: {
            updatePhotoProfile: {
                title: "Cambia tu foto de perfil",
                description: "Aquí puedes actualizar tu foto de perfil.",
                changeButton: "Cambiar foto",
                saveButton: "Guardar foto",
                deleteButton: "Eliminar foto",
            },
            personalInfo: {
                title: "Información personal",
                description: "Actualiza tus datos básicos.",
            },
            updateEmail: {
                title: "Correo asociado a tu cuenta",
                badge: "Verificado",
                description: (email: string) => `Tu correo es ${email}`,
                descriptionText: "Tu correo actual es ",
                confirmButton: "Confirmar correo",
                confirmMessage: "Confirma tu correo para activar los cambios",
                checkInbox:
                    "Revisa tu bandeja de entrada y aprueba el cambio de correo electrónico.",
                newEmailSuccess: "¡Listo! Tu nueva dirección de correo es ",
                newEmailLabel: "Nuevo correo ",
                confirmEmailLabel: "Confirmar nuevo correo",
                updateButton: "Actualizar correo",
                errorNotEquals: "Las direcciones de correo no coinciden.",
                succesMessageRedirect: "Esta notificación desaparecerá en ",
            },
            updatePassword: {
                title: "Cambia tu contraseña",
                description: "Recomendado: cambia tu contraseña cada 3 meses",
                currentPassword: "Contraseña actual",
                currentPasswordPlaceholder: "Contraseña actual...",
                newPassword: "Nueva contraseña",
                newPasswordPlaceholder: "Nueva contraseña...",
                confirmPassword: "Confirmar contraseña",
                confirmPasswordPlaceholder: "Confirmar contraseña...",
                updateButton: "Actualizar contraseña",
                errorNotEquals: "Las contraseñas ingresadas no coinciden.",
            },
            deleteAccount: {
                title: "Eliminar tu cuenta",
                description: "¿Está seguro de eliminar su cuenta?",
                descriptionComplete: "Esta acción es permanente.",
                btnTitle: "Eliminar",
                confirmTitle: "¿Está seguro de eliminar su cuenta?",
                confirmButton: "Eliminar definitivamente",
                succesMessageRedirect: "Redirigiendo al inicio en ",
                second: " s...",
            },
        },
        alerts: {
            updatePasswordSuccess: "!Listo! Contraseña actualizada con éxito.",
        },
    },
    welcomeUser: {
        header: {
            title: "Bienvenido ",
            subtitle: ", nos alegra verte aquí.",
        },
        sections: {
            completeRegister: "Completa tu registro",
        },
        alerts: {
            updateSuccess:
                "Tus datos personales se han actualizado correctamente. ¡Gracias por mantener tu información al día!",
        },
    },
    validation: {
        required: {
            firstName: "Ingresa tu primer nombre.",
            lastName: "Ingresa tu primer apellido.",
            age: "Selecciona tu edad.",
            sex: "Selecciona tu sexo.",
        },
        pattern: {
            name: "Solo se permiten letras y espacios.",
            age: "La edad debe ser un número.",
        },
        length: {
            minName: "Mínimo 2 caracteres.",
            maxName: "Máximo 50 caracteres.",
        },
        validate: {
            trim: "El campo no puede estar vacío.",
            ageNaN: "Edad no válida.",
            ageNegative: "La edad no puede ser negativa.",
            ageMax: "Edad no válida (máx 120).",
        },
    },
    errors: {
        image: {
            readFile: "Error leyendo archivo",
            blobGeneration: "Error generando blob",
        },
    },
};
