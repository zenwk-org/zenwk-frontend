import { UserMessages } from "@user/constants/user-messages";

/**
 * Convierte un arrayBuffer/base64 recibido del backend en un objeto URL usable por <img>
 * @param data
 * @returns
 */
export const backendToImageUrl = (data: ArrayBuffer | string): string => {
    let blob: Blob;

    // caso base64
    if (typeof data === "string") {
        const byteString = atob(data.split(",")[1]);
        const mimeString = data.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        blob = new Blob([ab], { type: mimeString });
    } else {
        // caso arrayBuffer
        blob = new Blob([data], { type: "image/jpeg" });
    }

    // usable en <img src={...} />
    return URL.createObjectURL(blob);
};

/**
 * Convierte la imagen antes de persistirla.
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
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target?.result)
                return reject(UserMessages.errors.image.readFile);

            img.src = e.target.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = Math.min(maxWidth / img.width, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Error creando canvas");

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob)
                            return reject(
                                UserMessages.errors.image.blobGeneration
                            );
                        const compressedFile = new File([blob], file.name, {
                            type: "image/jpeg",
                        });
                        resolve(compressedFile);
                    },
                    "image/jpeg",
                    quality
                );
            };
        };

        reader.onerror = () => reject(UserMessages.errors.image.readFile);
        reader.readAsDataURL(file);
    });
};
