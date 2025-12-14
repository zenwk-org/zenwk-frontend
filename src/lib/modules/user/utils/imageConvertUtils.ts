import { UserMessages } from "@/lib/modules/user/constants/user-messages";
/**
 *  Convierte un arrayBuffer/base64 recibido del backend en un objeto URL usable por <img>
 * @param data
 * @returns
 */
export const backendToImageUrl = (data: ArrayBuffer | string): string => {
    let blob: Blob;

    if (typeof data === "string") {
        const [, base64Data] = data.split(",");
        const mimeString = data.split(",")[0].split(":")[1].split(";")[0];

        if (!base64Data) {
            throw new Error("Invalid base64 data");
        }

        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.codePointAt(i) ?? 0; // Sonar: evitar charCodeAt
        }

        blob = new Blob([ab], { type: mimeString });
    } else {
        blob = new Blob([data], { type: "image/jpeg" });
    }

    return URL.createObjectURL(blob);
};

/**
 * Convierte y comprime imagen antes de persistirla.
 * @param file
 * @param quality
 * @param maxWidth
 * @returns
 */
export const compressImage = async (
    file: File,
    quality = 0.7,
    maxWidth = 800
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const imageLoadHandler = (img: HTMLImageElement) => {
            try {
                const canvas = createCanvas(img, maxWidth);
                const ctx = getCanvasContext(canvas);

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => handleBlob(blob, file, resolve, reject),
                    "image/jpeg",
                    quality
                );
            } catch (err) {
                reject(err instanceof Error ? err : new Error(String(err)));
            }
        };

        const reader = new FileReader();
        reader.onload = (e) => handleReaderLoad(e, imageLoadHandler, reject);
        reader.onerror = () =>
            reject(new Error(UserMessages.errors.image.readFile));

        reader.readAsDataURL(file);
    });
};

/* ------------------ helpers (evita nesting profundo) ------------------ */

/**
 * Maneja el evento `onload` del FileReader.
 * Crea una imagen temporal para luego procesarla en memoria.
 *
 * @param e - Evento disparado por FileReader al terminar de leer el archivo.
 * @param onLoad - Callback que recibe la imagen ya cargada y lista para procesar.
 * @param reject - Función para rechazar la promesa en caso de error.
 */
const handleReaderLoad = (
    e: ProgressEvent<FileReader>,
    onLoad: (img: HTMLImageElement) => void,
    reject: (reason?: unknown) => void
) => {
    const result = e.target?.result;
    if (!result) {
        reject(new Error(UserMessages.errors.image.readFile));
        return;
    }

    const img = new Image();
    img.onload = () => onLoad(img);
    img.onerror = () => reject(new Error("Error cargando imagen"));
    img.src = result as string;
};

/**
 * Crea dinámicamente un canvas según el tamaño máximo permitido.
 * Si la imagen es más grande, aplica un scale proporcional.
 *
 * @param img - Instancia de la imagen cargada.
 * @param maxWidth - Ancho máximo permitido para la compresión.
 * @returns Canvas generado y listo para dibujar.
 */
const createCanvas = (
    img: HTMLImageElement,
    maxWidth: number
): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    const scale = Math.min(maxWidth / img.width, 1); // nunca escala hacia arriba
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    return canvas;
};

/**
 * Obtiene el contexto 2D del canvas.
 * Si falla, lanza un Error para que se capture en la cadena de Promesa.
 *
 * @param canvas - Canvas previamente creado.
 * @returns Contexto 2D de canvas (garantizado).
 * @throws Error si el contexto no pudo ser creado.
 */
const getCanvasContext = (
    canvas: HTMLCanvasElement
): CanvasRenderingContext2D => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error(UserMessages.errors.image.blobGeneration);
    }
    return ctx;
};

/**
 * Convierte el contenido del canvas a Blob y lo encapsula como File.
 * Se utiliza dentro de la Promesa principal (compressImage).
 *
 * @param blob - Resultado del canvas.toBlob.
 * @param file - Archivo original para conservar nombre.
 * @param resolve - Resuelve la promesa con el nuevo archivo comprimido.
 * @param reject - Rechaza la promesa en caso de error.
 */
const handleBlob = (
    blob: Blob | null,
    file: File,
    resolve: (value: File | PromiseLike<File>) => void,
    reject: (reason?: unknown) => void
) => {
    if (!blob) {
        reject(new Error(UserMessages.errors.image.blobGeneration));
        return;
    }

    resolve(new File([blob], file.name, { type: "image/jpeg" }));
};
