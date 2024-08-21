import { Controller, Post, Body, Get, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDTO } from './dto/signin.dto';
import { Tokens } from './types';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Cookie, Public, UserAgent } from '@common/decorators';
import { Token } from '@prisma/client';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN


@ApiTags("Авторизация")
@Public()
@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

  @Post("signup")
  async signup(@Body() dto: SignUpDTO, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.signUp(dto, agent);
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
  }

  @Post("signin")
  async signin(@Body() dto: SignInDTO, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {

    const tokens = await this.authService.signIn(dto, agent);
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
  }

  @Get("refresh-tokens")
  async refreshToken(@Cookie(REFRESH_TOKEN) token: Token, @Res({ passthrough: true }) res: Response, @UserAgent() agent: string) {
    if (!token) { throw new UnauthorizedException() }
    console.log(token)
    const tokens = await this.authService.refreshToken(token.token, agent)
    await this.setRefreshTokenCookies(tokens, res)
    return { accessToken: tokens.accessToken }
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