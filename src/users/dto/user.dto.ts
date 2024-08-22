import { MESSAGES, REGEX } from "@common/utils";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';

export class UserDto {

    @ApiProperty({ description: 'Email пользователя', example: "test@test.com" })
    @IsOptional()
    @MinLength(5, { message: MESSAGES.EMAIL_RULE_MESSAGE })
    @IsEmail()
    readonly email?: string

    @ApiProperty({ description: 'Пароль пользователя', example: "Test1234@" })
    @IsOptional()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    @IsString()
    readonly password?: string;

    @ApiProperty({ description: 'Имя пользователя', example: "Username" })
    @IsOptional()
    @IsString()
    readonly username?: string
}
