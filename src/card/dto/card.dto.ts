import { ApiProperty } from "@nestjs/swagger"

export class CardDto {
    @ApiProperty({ description: "Текст карточки", example: "Текст карточки №1" })
    text: string
}
