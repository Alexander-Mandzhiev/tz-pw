import { Controller, Post, Body, Get, UnauthorizedException, Res, HttpStatus, UsePipes, HttpCode, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDTO } from './dto/signin.dto';
import { AccessToken, Tokens } from './types';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { Token } from '@prisma/client';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN


@ApiTags("Auth")
@Public()
@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: SignUpDTO })
  @ApiResponse({ status: 200, description: "Регистрация, refresh token будет отправлен в headers", type: AccessToken })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("signup")
  async signup(@Body() dto: SignUpDTO, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.signUp(dto, agent);
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiBody({ type: SignInDTO })
  @ApiResponse({ status: 200, description: "Авторизация, refresh token будет отправлен в headers", type: AccessToken })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  async signin(@Body() dto: SignInDTO, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.signIn(dto, agent);
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выпустить новый access token' })
  @ApiResponse({ status: 200, description: "Сгенерировать новый access token по refresh token который находится в cookies", type: AccessToken })
  @HttpCode(HttpStatus.OK)
  @Get("refresh-tokens")
  async refreshToken(@Cookie(REFRESH_TOKEN) token: Token, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {
    if (!token) { throw new UnauthorizedException() }
    const tokens = await this.authService.refreshToken(token.token, agent)
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
  }

  @ApiOperation({ summary: 'Выйти. Удалить токены и закрыть рабочую сессию' })
  @ApiResponse({ status: 200, description: "Удаление refresh tokena из базы данных и из cookies" })
  @HttpCode(HttpStatus.OK)
  @Get("logout")
  async logout(@Cookie(REFRESH_TOKEN) token: Token, @Res({ passthrough: true }) res: Response) {
    if (!token) {
      res.sendStatus(HttpStatus.OK)
      return
    }
    await this.authService.logout(token.token)
    res.cookie(REFRESH_TOKEN, "", { httpOnly: true, secure: true, expires: new Date() })
    res.sendStatus(HttpStatus.OK)
  }

  private async setRefreshTokenCookies(token: Tokens, res: Response) {
    if (!token) { throw new UnauthorizedException("Пользователь не авторизован") }
    res.cookie(REFRESH_TOKEN, token.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      domain: this.configService.get("DOMAIN"),
      expires: new Date(token.refreshToken.exp),
      secure: this.configService.get("SECURE"),
      path: "/"
    })
    // res.status(HttpStatus.CREATED).json({ accessToken: token.accessToken });
  }
}