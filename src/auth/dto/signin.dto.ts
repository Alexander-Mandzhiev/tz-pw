import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";
import { MESSAGES, REGEX } from "@auth/config/utils";

export class SignInDTO {

    @ApiProperty({ description: "Почтовый ящик пользователя", example: 'example@example.com' })
    @IsNotEmpty()
    @MinLength(+MESSAGES.EMAIL_RULE_MESSAGE_LENGTH, { message: MESSAGES.EMAIL_RULE_MESSAGE })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ description: "Ввести пароль", example: "Test1234@" })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @IsString()
    readonly password: string;

}