import { fetchJwtBaseApi } from "@app/helpers/fetch-api";
import { PersonDTO } from "@app/app/(modules)/user/types/person-dto";
import { safeValue } from "@app/shared/utils/stringUtils";

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
        const url = new URL(location, window.location.origin);
        const pathSegments = url.pathname.split("/").filter(Boolean);
        const id = pathSegments[pathSegments.length - 1];
        return id ?? null;
    } catch (error) {
        return null;
    }
};

/**
 * Consulta los datos de una persona a partri de su id.
 * @param idPerson
 * @param jwt
 */
export const getPerson = async (idPerson: number): Promise<PersonDTO> => {
    try {
        const path = "/persons/" + idPerson;
        const res = await fetchJwtBaseApi(
            path,
            undefined,
            undefined,
            undefined,
            "GET"
        );
        return res;
    } catch (error) {
        throw error;
    }
};

/**
 * Crea o actualiza la persona.
 * @param jwt
 * @param personDTO
 */
export const updateOrCreatePerson = async (
    dataPerson: any | undefined,
    user: any | undefined,
    editDataBasic: boolean | undefined,
    idPerson?: number | undefined
) => {
    // console.log(dataPerson);
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
    // sconsole.log(payload);
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
