import {
    loginApi,
    refreshAuthJwt,
    politiciesPassword,
} from "@auth/utils/authUtils";
import { fetchJwtBaseApi } from "@app/helpers/fetch-api";

jest.mock("@app/helpers/fetch-api");
const mockedFetch = fetchJwtBaseApi as jest.MockedFunction<
    typeof fetchJwtBaseApi
>;

describe("Auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("loginApi", () => {
        it("debe llamar fetchJwtBaseApi con POST y retornar resultado", async () => {
            const fakeResponse = { token: "jwt123", userId: 1 };
            mockedFetch.mockResolvedValueOnce(fakeResponse as any);

            const result = await loginApi("test@example.com", "password123");

            expect(mockedFetch).toHaveBeenCalledWith(
                "/auth/login",
                undefined,
                undefined,
                { username: "test@example.com", password: "password123" },
                "POST"
            );
            expect(result).toStrictEqual(fakeResponse);
        });

        it("debe propagar error si fetchJwtBaseApi falla", async () => {
            const error = new Error("Network error");
            mockedFetch.mockRejectedValueOnce(error);

            await expect(
                loginApi("test@example.com", "password123")
            ).rejects.toThrow("Network error");
        });
    });

    describe("refreshAuthJwt", () => {
        it("debe llamar fetchJwtBaseApi con GET y retornar jwt", async () => {
            const fakeJwt = "newJwtToken";
            mockedFetch.mockResolvedValueOnce(fakeJwt as any);

            const result = await refreshAuthJwt("oldJwtToken");

            expect(mockedFetch).toHaveBeenCalledWith(
                "/users/auth/refresh-jwt",
                undefined,
                "oldJwtToken",
                undefined,
                "GET"
            );
            expect(result).toBe(fakeJwt);
        });

        it("debe propagar error si fetchJwtBaseApi falla", async () => {
            const error = new Error("Failed refresh");
            mockedFetch.mockRejectedValueOnce(error);

            await expect(refreshAuthJwt("oldJwtToken")).rejects.toThrow(
                "Failed refresh"
            );
        });
    });

    describe("politiciesPassword", () => {
        it("debe contener todas las reglas de política de contraseña", () => {
            expect(politiciesPassword).toEqual([
                { id: "min_length", rule: "Mínimo 8 caracteres" },
                { id: "uppercase", rule: "Una mayúscula (A-Z)" },
                { id: "lowercase", rule: "Una minúscula (a-z)" },
                { id: "number", rule: "Un número (0-9)" },
                {
                    id: "special_char",
                    rule: "Un carácter especial (ej: @ # $ %)",
                },
            ]);
        });

        it("cada regla debe tener id y rule como string", () => {
            politiciesPassword.forEach((rule) => {
                expect(typeof rule.id).toBe("string");
                expect(typeof rule.rule).toBe("string");
            });
        });
    });
});
