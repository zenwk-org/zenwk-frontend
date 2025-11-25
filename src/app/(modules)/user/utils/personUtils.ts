import { fetchJwtBaseApi } from "@app/helpers/fetch-api";
import { PersonDTO } from "@app/app/(modules)/user/types/person-dto";
import { safeValue } from "@app/shared/utils/stringUtils";
import { UserDTO } from "../types/user-dto";

/**
 * Extrae el ID del header "Location" de una respuesta HTTP.
 * Sirve para respuestas tipo 201 Created que devuelven:
 * Location: http://servidor/api/resource/{id}
 *
 * @param response - Objeto Response retornado por fetch()
 * @returns El ID extraído como string o null si no se encuentra.
 */
export const getPathId = (response: Response): string | null => {
    const location = response.headers.get("Location");
    if (!location) {
        return null;
    }

    try {
        const url = new URL(location, globalThis.location.origin); // Sonar: uso de globalThis
        const pathSegments = url.pathname.split("/").filter(Boolean);
        return pathSegments.at(-1) ?? null;
    } catch {
        return null;
    }
};

/**
 * Consulta los datos de una persona a partri de su id.
 * @param idPerson
 * @param jwt
 */
export const getPerson = async (idPerson: number): Promise<PersonDTO> => {
    const path = "/persons/" + idPerson;
    return await fetchJwtBaseApi(path, undefined, undefined, undefined, "GET");
};

// Sonar. Posibles interfaces mínimas (ajusta según tu modelo real)
interface PersonData {
    [key: string]: unknown;
}

/**
 * Crea o actualiza la persona.
 * @param jwt
 * @param personDTO
 */
export const updateOrCreatePerson = async (
    dataPerson: PersonData | undefined,
    user: UserDTO | undefined,
    editDataBasic: boolean | undefined,
    idPerson?: number
): Promise<Response> => {
    const path = buildPersonPath(idPerson, editDataBasic);
    const personJson = buildPersonPayload(
        undefined,
        dataPerson,
        user,
        editDataBasic
    );
    const res = await fetchJwtBaseApi(
        path,
        undefined,
        undefined,
        personJson,
        editDataBasic ? "PUT" : "POST"
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res;
};

/**
 * Inicialización de payload
 * @param data
 * @returns
 */
export const getPayload = (data: any) => {
    const payload: Record<string, string | number | boolean | undefined> = {
        firstName: data.firstName,
        lastName: data.lastName,
    };

    if (
        data &&
        typeof data.age === "number" &&
        typeof data.idSex === "number"
    ) {
        payload.age = data.age;
        payload.idSex = data.idSex;
    } else {
        payload.age = Number(data.age.value);
        payload.idSex = Number(data.sex.value);
    }

    if (safeValue(data.middleName)) {
        payload.middleName = data.middleName;
    }
    if (safeValue(data.middleLastName)) {
        payload.middleLastName = data.middleLastName;
    }
    return payload;
};

/**
 * Construye el payload JSON de Person a partir del formulario y el DTO.
 */
export const buildPersonPayload = (
    data: any,
    personDTO: any,
    user: any,
    editDataBasic: boolean | undefined
): Record<string, string | number | boolean | undefined> => {
    const payload = getPayload(data || personDTO);

    payload.profilePicture = personDTO?.profilePicture;

    if (!editDataBasic) {
        payload.idUser = user.id;
    }

    return payload;
};

/**
 * Construye el path dependiendo si es creación o edición.
 */
export const buildPersonPath = (
    idPerson: number | undefined,
    editDataBasic: boolean | undefined
): string => {
    return editDataBasic && idPerson ? `/persons/${idPerson}` : "/persons";
};
