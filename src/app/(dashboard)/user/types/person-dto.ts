/**
 * Interface que representa los datos basicos de la persona.
 */
export interface PersonDTO {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    middleLastName?: string;
    dateOfBirth?: string;
    address?: string;
    age: number;
    idSex: number;
    profilePicture?: boolean | string;
}
