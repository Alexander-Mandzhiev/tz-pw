import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";

export class OrderDto {
    @ApiProperty({
        description: "Идентификаторы колонок, изменение порядка", example: {
            "ids": [
                "ba42f05f-f940-4014-a413-a91a3001b5fc",
                "9a247c28-f8d9-4d0b-82b4-8d2b6129400e"
            ]
        }
    })
    @IsOptional()
    @IsArray()
    readonly ids?: [string]
}