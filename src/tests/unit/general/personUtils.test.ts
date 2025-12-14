import {
    getPathId,
    getPerson,
    updateOrCreatePerson,
    getPayload,
    buildPersonPayload,
    buildPersonPath,
} from "@/lib/modules/user/utils/personUtils";
import { fetchJwtBaseApi } from "@/lib/shared/utils/fetchApi";

jest.mock("@/lib/shared/utils/fetchApi");
const mockedFetch = fetchJwtBaseApi as jest.MockedFunction<
    typeof fetchJwtBaseApi
>;

// Mock simple de Response
class MockResponse {
    headers: Map<string, string>;
    constructor(headers?: Record<string, string>) {
        this.headers = new Map(Object.entries(headers || {}));
    }
    get(name: string) {
        return this.headers.get(name) || null;
    }
}

describe("Person Utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getPathId", () => {
        it("debe retornar el ID desde Location válido", () => {
            const response = new MockResponse({
                Location: "http://localhost/persons/123",
            }) as unknown as Response;
            expect(getPathId(response)).toBe("123");
        });

        it("debe retornar null si Location no existe", () => {
            const response = new MockResponse() as unknown as Response;
            expect(getPathId(response)).toBeNull();
        });

        it("debe retornar null si URL es inválida", () => {
            const response = new MockResponse({
                Location: "http://\u0000invalid",
            }) as unknown as Response;
            expect(getPathId(response)).toBeNull();
        });
    });

    describe("getPerson", () => {
        it("debe llamar fetchJwtBaseApi con path correcto", async () => {
            const fakePerson = { firstName: "John" };
            mockedFetch.mockResolvedValueOnce(fakePerson as any);

            const result = await getPerson(1);
            expect(mockedFetch).toHaveBeenCalledWith(
                "/persons/1",
                undefined,
                undefined,
                undefined,
                "GET"
            );
            expect(result).toEqual(fakePerson);
        });
    });

    describe("updateOrCreatePerson", () => {
        it("debe usar POST cuando editDataBasic es false", async () => {
            const fakeResponse = {} as Response;
            mockedFetch.mockResolvedValueOnce(fakeResponse);
            const data = {
                sex: { label: "M", value: "M" },
                age: { label: "20", value: "20" },
            };

            const start = Date.now();
            const res = await updateOrCreatePerson(
                data,
                { id: 5 } as any,
                false
            );
            const duration = Date.now() - start;

            expect(mockedFetch).toHaveBeenCalledWith(
                "/persons",
                undefined,
                undefined,
                expect.any(Object),
                "POST"
            );
            expect(duration).toBeGreaterThanOrEqual(1000);
            expect(res).toStrictEqual(fakeResponse);
        });

        it("debe usar PUT cuando editDataBasic es true y idPerson existe", async () => {
            const fakeResponse = {} as Response;
            mockedFetch.mockResolvedValueOnce(fakeResponse);

            const data = {
                sex: { label: "M", value: "M" },
                age: { label: "20", value: "20" },
            };

            const res = await updateOrCreatePerson(
                data,
                { id: 5 } as any,
                true,
                10
            );

            expect(mockedFetch).toHaveBeenCalledWith(
                "/persons/10",
                undefined,
                undefined,
                expect.any(Object),
                "PUT"
            );
            expect(res).toStrictEqual(fakeResponse);
        });
    });

    describe("getPayload", () => {
        it("debe construir payload básico", () => {
            const data = { firstName: "A", lastName: "B", age: 30, idSex: 1 };
            const payload = getPayload(data);
            expect(payload).toEqual({
                firstName: "A",
                lastName: "B",
                age: 30,
                idSex: 1,
            });
        });

        it("debe convertir strings a números si age/idSex no son numbers", () => {
            const data = {
                firstName: "A",
                lastName: "B",
                age: { value: "25" },
                sex: { value: "2" },
            };
            const payload = getPayload(data);
            expect(payload.age).toBe(25);
            expect(payload.idSex).toBe(2);
        });

        it("debe incluir middleName y middleLastName si existen", () => {
            const data = {
                firstName: "A",
                lastName: "B",
                middleName: "M",
                middleLastName: "ML",
                age: 1,
                idSex: 1,
            };
            const payload = getPayload(data);
            expect(payload.middleName).toBe("M");
            expect(payload.middleLastName).toBe("ML");
        });
    });

    describe("buildPersonPayload", () => {
        it("debe agregar profilePicture y idUser correctamente", () => {
            const data = { firstName: "A", lastName: "B", age: 1, idSex: 1 };
            const user = { id: 10 };
            const personDTO = { profilePicture: "pic.png" };
            const payload = buildPersonPayload(data, personDTO, user, false);

            expect(payload.profilePicture).toBe("pic.png");
            expect(payload.idUser).toBe(10);
        });

        it("no debe agregar idUser si editDataBasic es true", () => {
            const data = { firstName: "A", lastName: "B", age: 1, idSex: 1 };
            const user = { id: 10 };
            const personDTO = { profilePicture: "pic.png" };
            const payload = buildPersonPayload(data, personDTO, user, true);

            expect(payload.idUser).toBeUndefined();
        });
    });

    describe("buildPersonPath", () => {
        it("debe retornar path con id cuando editDataBasic es true", () => {
            expect(buildPersonPath(5, true)).toBe("/persons/5");
        });

        it("debe retornar path sin id cuando editDataBasic es false", () => {
            expect(buildPersonPath(undefined, false)).toBe("/persons");
        });
    });
});
