import { ApiProperty } from "@nestjs/swagger";


export class IBase {
    @ApiProperty({ description: 'Уникальный идентификатор', example: "clx3968w80001klbslniv3jwf" })
    id: string;
    @ApiProperty({ description: 'Дата создания пользователя', example: '2023-06-29T11:35:09.918Z' })
    createdAt: Date;
}

export class UserResponse extends IBase {
    @ApiProperty({ description: 'Email пользователя', example: "Password@123" })
    email: string;
    @ApiProperty({ description: 'Имя пользователя', example: "admin" })
    username: string;
}

export class User extends UserResponse {
    @ApiProperty({ description: 'Пароль пользователя', example: "Password@123" })
    password: string;
}

export class UpdateUsersResponse {
    @ApiProperty({ description: 'Email пользователя', example: "Password@123" })
    email: string;
    @ApiProperty({ description: 'Имя пользователя', example: "admin" })
    username: string;
}


export class DeleteMessage {
    @ApiProperty({ description: 'Удаление пользователя', example: "Пользователь успешно удален!" })
    message: string
}