import { PersonDTO } from "@app/app/(dashboard)/user/types/person-dto";
/**
 * Enum que define los posibles estados de un usuario dentro del sistema.
 */
export enum UserStateEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    INCOMPLETE_PERFIL = "INCOMPLETE_PERFIL",
}

/**
 * Define la estructura del objeto de transferencia de datos (DTO) para un usuario del sistema.
 */
export interface UserDTO {
    id: number;
    idPerson?: number;
    username: string;
    password?: string;
    email: string;
    state?: UserStateEnum;
    person?: PersonDTO;
}
