import { ApiProperty } from "@nestjs/swagger"

export class DeleteResponse {
    @ApiProperty({ description: "Уникальный идентификатор карточки", example: "eda70e90-1371-4cbe-a0f4-5a7e78058da4" })
    id: string
}

export class CardResponse extends DeleteResponse {
    @ApiProperty({ description: "Текст карточки", example: "Текст карточки №1" })
    text: string
    @ApiProperty({ description: "Идентификатор колонки", example: "Колонка №1" })
    columnId: string
    @ApiProperty({ description: "Порядковый номер колонки", example: 1 })
    order: number
}

export class GetAllCardForColumn {
    @ApiProperty({
        description: 'Получить все колонки', example:
            [
                {
                    "id": "a641b9f7-a05a-4745-b1e8-33269f96aa5b",
                    "text": "Карточка №1",
                    "order": 2,
                    "columnId": "9a247c28-f8d9-4d0b-82b4-8d2b6129400e"
                },
                {
                    "id": "5020bbe9-f380-4337-9ca8-58c2e505cc18",
                    "text": "Карточка №2",
                    "order": 2,
                    "columnId": "9a247c28-f8d9-4d0b-82b4-8d2b6129400e"
                }
            ]
    })
    data: CardResponse[]
}