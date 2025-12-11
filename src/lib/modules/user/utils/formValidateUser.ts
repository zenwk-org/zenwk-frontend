import { RegisterOptions } from "react-hook-form";
import { UserMessages } from "@app/lib/modules/user/constants/user-messages";

/**
 * Define y retorna un conjunto de validaciones comunes para
 * formularios de datos personales de usuario: nombres, apellidos,
 * edad y sexo.
 */
export const formValidateUser = () => {
    // Validación para nombres y apellidos: solo letras y espacios
    const patternName: RegisterOptions["pattern"] = {
        value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s'-]+$/,
        message: UserMessages.validation.pattern.name,
    };

    // Longitud mínima y máxima para nombres/apellidos
    const minLengthName: RegisterOptions["minLength"] = {
        value: 2,
        message: UserMessages.validation.length.minName,
    };

    const maxLengthName: RegisterOptions["maxLength"] = {
        value: 50,
        message: UserMessages.validation.length.maxName,
    };

    // Validación para edad (solo números y rango válido)
    const patternAge: RegisterOptions["pattern"] = {
        value: /^\d+$/, // SonarQube: uso de \d en lugar de [0-9]
        message: UserMessages.validation.pattern.age,
    };

    const validateAge: RegisterOptions["validate"] = {
        range: (v: string) => {
            const num = Number.parseInt(v, 10);
            if (Number.isNaN(num))
                return UserMessages.validation.validate.ageNaN;
            if (num < 0) return UserMessages.validation.validate.ageNegative;
            if (num > 120) return UserMessages.validation.validate.ageMax;
            return true;
        },
    };

    // Validación de espacios vacíos
    const validateTrim = (v: string): string | true => {
        if (!v.trim()) return UserMessages.validation.validate.trim;
        return true;
    };

    // Retorna todas las validaciones disponibles para los formularios
    return {
        requiredFirstName: UserMessages.validation.required.firstName,
        requiredLastName: UserMessages.validation.required.lastName,
        requiredAge: UserMessages.validation.required.age,
        requiredSex: UserMessages.validation.required.sex,
        patternName,
        minLengthName,
        maxLengthName,
        validateTrim,
        validateAge,
        patternAge,
    };
};
