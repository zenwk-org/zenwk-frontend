/**
 * Mensajes para las page para el módulo (auth)
 */

export const AuthMessages = {
    login: {
        title: "Gracias por unirte a Zenwk",
        subtitle:
            "Inicia sesión y descubre una nueva forma de gestionar tus tareas y proyectos.",
        resetPassword: {
            title: "Listo para seguir",
            newPassword: "Nueva contraseña",
            newRePassword: "Confirmar nueva contraseña",
        },
    },
    register: {
        title: "Empieza a usar ZenWk",
        welcome: " Fluye con tu trabajo y conócete en el proceso.",
        subtitle: "Da el primer paso, regístrate.",
        linkText: "Regístrate",
        promptText: "¿No tienes una cuenta? ",
        enterPassword: "¡Crea tu contraseña y toma el control de tu jornada!",
    },
    otp: {
        title: "Ingresa el código que llegó a tu correo",
        subtitleSendEmail: "Te hemos enviado un código a ",
        subtitleEnterCode: " ingresa el código recibido para continuar.",
        emailNotFound: "¿No ves nuestro correo en tu bandeja de entrada?",
        codeResentSuccess: "¡Código generado exitosamente! Revisa tu correo.",
        emailSent:
            "Hemos enviado un código a tu correo. Por favor, revisa tu bandeja de entrada.",
        checkSpamOrClick: " Revisa tu carpeta de spam o haz clic ",
        resendCodeLink: " para reenviar el código.",
        emailExist: "Correo ya registrado.",
        emailNotExist: "Correo no registrado.",
    },
    forgotPassword: {
        title: "¿Olvidaste tu contraseña?",
        subtitle: "A todos nos pasa. Ingresa tu correo y te ayudamos.",
        linkText: "¿Olvidaste tu contraseña? Restablécela",
        // SPA. Envío exitoso de correo
        sendEmail: {
            title: "¡Todo listo!",
            // El componente .jSX debe enviar la variable "keyWord..." para asegurar la redación del mesnaje
            hello: "Si tu correo ",
        },
    },
    commons: {
        sendEmail: {
            // ... se autocompleta el texto con la constante definida en AuthMessages.<Componente>.<sendEmail | |showScreen>.hello
            successText:
                " está asociado a una cuenta ZenWk, pronto recibirás un mensaje con los pasos para restablecer tu contraseña",
            openInbox:
                "No olvides revisar tu bandeja de entrada y también la de spam o correos no deseados.",
        },
    },
    placeholder: {
        password: "Escribe tu contraseña",
        repassword: "Confirma tu contraseña",
    },
    setPassword: {
        title: "Elige una contraseña",
    },
    inputs: {
        email: "Dirección de correo",
        password: "Ingresa tu contraseña",
        repasword: "Confirmar contraseña",
    },
    buttons: {
        forgotPassword: "Sí, olvidé mi contraseña",
        login: "Inicio de sesión",
        registerWithEmail: "Continuar con el correo",
        saveContinue: "Guardar y seguir",
        redirectLogin: "Redirigiendo a inicio de sesión ",
    },
    tooltip: {
        showPassword: "Ver contraseña",
        hidePassword: "Ocultar contraseña",
    },
};
