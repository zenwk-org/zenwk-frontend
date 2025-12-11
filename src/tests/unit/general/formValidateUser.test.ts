import { formValidateUser } from "@app/lib/modules/user/utils/formValidateUser";
import { UserMessages } from "@app/lib/modules/user/constants/user-messages";

describe("formValidateUser", () => {
    const { validateAge, validateTrim } = formValidateUser();

    describe("validateAge.range", () => {
        const range = validateAge.range!; // aseguramos que no es undefined

        it("debe retornar mensaje si el valor no es un número", () => {
            expect(range("abc", {} as any)).toBe(
                UserMessages.validation.validate.ageNaN
            );
            expect(range("", {} as any)).toBe(
                UserMessages.validation.validate.ageNaN
            );
        });

        it("debe retornar mensaje si el valor es negativo", () => {
            expect(range("-5", {} as any)).toBe(
                UserMessages.validation.validate.ageNegative
            );
        });

        it("debe retornar mensaje si el valor es mayor a 120", () => {
            expect(range("121", {} as any)).toBe(
                UserMessages.validation.validate.ageMax
            );
        });

        it("debe retornar true si el valor es un número válido entre 0 y 120", () => {
            expect(range("0", {} as any)).toBe(true);
            expect(range("25", {} as any)).toBe(true);
            expect(range("120", {} as any)).toBe(true);
        });
    });

    describe("validateTrim", () => {
        it("debe retornar mensaje si el string está vacío o solo tiene espacios", () => {
            expect(validateTrim("")).toBe(
                UserMessages.validation.validate.trim
            );
            expect(validateTrim("   ")).toBe(
                UserMessages.validation.validate.trim
            );
        });

        it("debe retornar true si el string tiene contenido no vacío", () => {
            expect(validateTrim("John")).toBe(true);
            expect(validateTrim(" A ")).toBe(true);
        });
    });
});
