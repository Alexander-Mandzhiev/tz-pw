import { ApiProperty } from "@nestjs/swagger"

export class DeleteResponse {
    @ApiProperty({ description: "Уникальный идентификатор комментария", example: "80484d4e-0ae9-407a-82c4-f5ffd0d0f7b9" })
    id: string
}

export class CreateCommentResponse extends DeleteResponse {
    @ApiProperty({ description: "Дата создания комментария", example: "2024-08-22T21:50:26.110Z" })
    createdAt: Date
    @ApiProperty({ description: "Имя пользователя оставившего комментарий", example: "Рома" })
    name: string
    @ApiProperty({ description: "Текс комментария", example: "Текст комментария №1" })
    text: string
    @ApiProperty({ description: "Уникальный идентификатор пользователя", example: "6721e775-3d68-4fc0-825e-d1e011fa9b19" })
    userId: number
    @ApiProperty({ description: "Уникальный идентификатор карточки", example: "a641b9f7-a05a-4745-b1e8-33269f96aa5b" })
    cardId: number
}

export class CommentsResponse extends DeleteResponse {
    @ApiProperty({ description: "Имя пользователя оставившего комментарий", example: "Рома" })
    name: string
    @ApiProperty({ description: "Текс комментария", example: "Текст комментария №1" })
    text: string
}

export class CommentsUserResponse extends CommentsResponse {
    @ApiProperty({ description: "Уникальный идентификатор карточки", example: "a641b9f7-a05a-4745-b1e8-33269f96aa5b" })
    cardId: number
}

export class CommentsCardResponse extends CommentsResponse {
    @ApiProperty({ description: "Уникальный идентификатор пользователя", example: "6721e775-3d68-4fc0-825e-d1e011fa9b19" })
    userId: number
}

export class AllUserCommentsResponse {
    @ApiProperty({
        description: "Вывести все комментарии пользователя", example: [
            {
                "id": "80484d4e-0ae9-407a-82c4-f5ffd0d0f7b9",
                "text": "Комментарий №1",
                "name": "Рома",
                "cardId": "a641b9f7-a05a-4745-b1e8-33269f96aa5b"
            }
        ]
    })

    data: CommentsUserResponse[]
}

export class AllCardCommentsResponse {
    @ApiProperty({
        description: "Вывести все комментарии пользователя",
        example: [
            {
                "id": "80484d4e-0ae9-407a-82c4-f5ffd0d0f7b9",
                "name": "Рома",
                "text": "Комментарий №1",
                "userId": "6721e775-3d68-4fc0-825e-d1e011fa9b19"
            }
        ]
    })

    data: CommentsCardResponse[]
}
