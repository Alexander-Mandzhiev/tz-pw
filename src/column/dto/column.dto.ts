import { CREATING } from "@common/utils"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class ColumnDto {
    @ApiProperty({ description: "Название колонки", example: "Колонка № 1" })
    @IsNotEmpty()
    @MinLength(+CREATING.MIN_RULE_LENGTH, { message: CREATING.MIN_RULE_MESSAGE })
    @IsString()
    readonly title: string
    
    @ApiProperty({ description: "Краткое описание колонки", example: "Описание колонки № ..." })
    @IsOptional()
    @IsString()
    readonly description?: string

}
