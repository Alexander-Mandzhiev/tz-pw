import { ApiProperty } from "@nestjs/swagger"
import { Token } from "@prisma/client"


export class AccessToken {
    @ApiProperty({ description: "access token пользователя", example: '"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjFlNzc1LTNkNjgtNGZjMC04MjVlLWQxZTAxMWZhOWIxOSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTcyNDMzOTM2NywiZXhwIjoxNzI0MzY5MzY3fQ.Y0k73XSQeQHe-KXhtkHyatdDzM2K007OuBE5755po90"' })
    accessToken: string
}

export class Tokens extends AccessToken {
    @ApiProperty({ description: "refresh token пользователя, будет отправлен в заголовках, http:true", example: 'refreshToken=j%3A%7B%22token%22%3A%222b6bd895-eb7c-45dd-81d7-f85725dbbd32%22%2C%22exp%22%3A%222024-09-22T15%3A09%3A27.534Z%22%2C%22userAgent%22%3A%22PostmanRuntime%2F7.41.1%22%2C%22userId%22%3A%226721e775-3d68-4fc0-825e-d1e011fa9b19%22%7D; Path=/; Domain=localhost; Secure; HttpOnly; Expires=Sun, 22 Sep 2024 15:09:27 GMT;' })
    refreshToken: Token
}

export class JwtPayload {
    @ApiProperty({ description: "Id пользователя", example: "6721e775-3d68-4fc0-825e-d1e011fa9b19" })
    id: string
    @ApiProperty({ description: "Email пользователя", example: "test@test.com" })
    email: string
    @ApiProperty({ description: "Имя пользователя", example: "Даня" })
    username: string
}