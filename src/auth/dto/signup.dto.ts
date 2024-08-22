import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { SignInDTO } from "./signin.dto";
import { MESSAGES, REGEX } from "@common/utils";

export class SignUpDTO extends SignInDTO {

    @ApiProperty({ description: "Подтверждения пароля", example: "Test1234@" })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @IsString()
    readonly verify: string;
}