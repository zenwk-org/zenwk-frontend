import { backendToImageUrl } from "@app/app/(modules)/user/utils/ImageConvertUtils";

describe("backendToImageUrl", () => {
    const mockCreateObjectURL = jest.fn(() => "mock://url");
    const originalURL = URL.createObjectURL;

    beforeAll(() => {
        // Mock global URL
        URL.createObjectURL = mockCreateObjectURL;
    });

    afterAll(() => {
        URL.createObjectURL = originalURL;
    });

    test("convierte base64 válido en blob y regresa un objectURL", () => {
        const base64 = "data:image/png;base64," + btoa("ABC123");

        const url = backendToImageUrl(base64);

        expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
        expect(url).toBe("mock://url");
    });

    test("lanza error si el base64 es inválido", () => {
        expect(() => backendToImageUrl("data:image/png;base64,")).toThrow(
            "Invalid base64 data"
        );
    });

    test("convierte ArrayBuffer a blob y regresa objectURL", () => {
        const ab = new ArrayBuffer(3);

        const url = backendToImageUrl(ab);

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockCreateObjectURL.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(url).toBe("mock://url");
    });
});
