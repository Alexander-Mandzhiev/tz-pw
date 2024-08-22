import { ApiProperty } from "@nestjs/swagger";

export class CommentDto {
    @ApiProperty({ description: "Текст комментария", example: "Текст комментария №1" })
    text: string
}
