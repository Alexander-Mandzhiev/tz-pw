import { ApiProperty } from "@nestjs/swagger"
import { CardResponse } from "src/card/types"


export class DeleteResponse {
    @ApiProperty({ description: "Уникальный идентификатор колонки", example: "eda70e90-1371-4cbe-a0f4-5a7e78058da4" })
    id: string
}

export class ColumnResponse extends DeleteResponse {
    @ApiProperty({ description: "Название колонки", example: "Колонка № 1" })
    title: string
    @ApiProperty({ description: "Описание колонки", example: "Описание 1 колонки" })
    description: string
    @ApiProperty({ description: "Порядковый номер колонки", example: 1 })
    order: number
    @ApiProperty({
        description: "Порядковый номер колонки", example: [
            {
                "id": "a641b9f7-a05a-4745-b1e8-33269f96aa5b",
                "text": "Карточка №1",
                "order": 0
            },
            {
                "id": "5020bbe9-f380-4337-9ca8-58c2e505cc18",
                "text": "Карточка №2",
                "order": 1
            }
        ]
    })
    cards: CardResponse[]
}

export class GetAllColumns {
    @ApiProperty({
        description: 'Получить все колонки', example:
            [
                {
                    "id": "ba42f05f-f940-4014-a413-a91a3001b5fc",
                    "title": "Колонка № 2",
                    "description": "Описание 2 колонки",
                    "order": 0,
                    "cards": []
                },
                {
                    "id": "9a247c28-f8d9-4d0b-82b4-8d2b6129400e",
                    "title": "Колонка № 1",
                    "description": "Описание 1 колонки",
                    "order": 1,
                    "cards": [
                        {
                            "id": "a641b9f7-a05a-4745-b1e8-33269f96aa5b",
                            "text": "Карточка №1",
                            "order": 0
                        },
                        {
                            "id": "5020bbe9-f380-4337-9ca8-58c2e505cc18",
                            "text": "Карточка №2",
                            "order": 1
                        }
                    ]
                }
            ]
    })
    data: ColumnResponse[]
}