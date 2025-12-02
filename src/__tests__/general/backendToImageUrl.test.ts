import {
    backendToImageUrl,
    compressImage,
} from "@app/app/(modules)/user/utils/ImageConvertUtils";

import { UserMessages } from "@user/constants/user-messages";

// ------------------------------
// Utils
// ------------------------------
const createMockFile = () =>
    new File(["hello"], "photo.jpg", { type: "image/jpeg" });

const mockCreateObjectURL = jest.fn(() => "mock://url");
const originalURL = URL.createObjectURL;

describe("ImageConvertUtils", () => {
    let mockReader: any;
    let mockImg: any;

    beforeEach(() => {
        jest.clearAllMocks();

        URL.createObjectURL = mockCreateObjectURL;

        // FileReader
        mockReader = {
            readAsDataURL: jest.fn(),
            onload: null,
            onerror: null,
        };
        jest.spyOn(global, "FileReader").mockImplementation(() => mockReader);

        // Image
        mockImg = {
            onload: null,
            onerror: null,
            set src(v) {},
        };
        jest.spyOn(global, "Image").mockImplementation(() => mockImg);
    });

    afterAll(() => {
        URL.createObjectURL = originalURL;
    });

    // --------------------------------------------------
    // backendToImageUrl
    // --------------------------------------------------

    test("convierte base64 válido en blob y genera URL", () => {
        const base64 = "data:image/png;base64," + btoa("ABC123");
        const result = backendToImageUrl(base64);

        expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
        expect(result).toBe("mock://url");
    });

    test("error si base64 no tiene datos", () => {
        expect(() => backendToImageUrl("data:image/png;base64,")).toThrow(
            "Invalid base64 data"
        );
    });

    test("convierte ArrayBuffer a blob correctamente", () => {
        const ab = new ArrayBuffer(5);
        const result = backendToImageUrl(ab);

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(result).toBe("mock://url");
    });

    // --------------------------------------------------
    // compressImage
    // --------------------------------------------------

    test("rechaza si reader.onerror ocurre", async () => {
        const file = createMockFile();

        const promise = compressImage(file);

        mockReader.onerror();

        await expect(promise).rejects.toThrow(
            UserMessages.errors.image.readFile
        );
    });

    test("rechaza si reader.onload recibe result null", async () => {
        const file = createMockFile();
        const promise = compressImage(file);

        mockReader.onload({ target: { result: null } });

        await expect(promise).rejects.toThrow(
            UserMessages.errors.image.readFile
        );
    });

    test("rechaza si imagen falla al cargar", async () => {
        const file = createMockFile();
        const promise = compressImage(file);

        mockReader.onload({ target: { result: "data:image/jpeg;base64,AAA" } });

        mockImg.onerror();

        await expect(promise).rejects.toThrow("Error cargando imagen");
    });

    test("error si canvas.getContext devuelve null", async () => {
        const file = createMockFile();
        const promise = compressImage(file);

        // lector listo
        mockReader.onload({ target: { result: "data:image/jpeg;base64,AAA" } });

        // mock del canvas
        document.createElement = () =>
            ({
                width: 200,
                height: 200,
                getContext: () => null,
            }) as any;

        // ejecutamos manualmente img.onload
        mockImg.onload();

        await expect(promise).rejects.toThrow(
            UserMessages.errors.image.blobGeneration
        );
    });

    test("error si canvas.toBlob retorna null", async () => {
        const file = createMockFile();
        const promise = compressImage(file);

        mockReader.onload({ target: { result: "data:image/jpeg;base64,AAA" } });

        document.createElement = () =>
            ({
                width: 200,
                height: 200,
                getContext: () => ({ drawImage: jest.fn() }),
                toBlob: (cb: any) => cb(null),
            }) as any;

        mockImg.onload();

        await expect(promise).rejects.toThrow(
            UserMessages.errors.image.blobGeneration
        );
    });

    test("retorna un File cuando la compresión es exitosa", async () => {
        const file = createMockFile();
        const promise = compressImage(file);

        mockReader.onload({ target: { result: "data:image/jpeg;base64,AAA" } });

        document.createElement = () =>
            ({
                width: 200,
                height: 200,
                getContext: () => ({ drawImage: jest.fn() }),
                toBlob: (cb: any) => cb(new Blob(["IMG"])),
            }) as any;

        mockImg.onload(); // forzamos ejecución del flujo

        const result = await promise;

        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe("photo.jpg");
    });
});
