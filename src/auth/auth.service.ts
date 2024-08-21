import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDTO, SignInDTO } from './dto';
import { UsersService } from '@users/users.service';
import { Tokens } from './types';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService) { }

  async signUp(dto: SignUpDTO, agent: string) {
    if (dto.password != dto.verify) { throw new BadRequestException('Пароли не совпадают!'); }
    const userExist = await this.userService.findOneByEmail(dto.email)
    console.log(userExist)
    if (userExist) { throw new ConflictException('Пользователь с таким email зарегистрирован!'); }
    const user = await this.userService.create(dto)
    return await this.createAndExistTokens(user, agent)
  }


  async signIn(dto: SignInDTO, agent: string): | Promise<Tokens> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (!user || !compareSync(dto.password, user.password)) throw new UnauthorizedException('Не верный логин или пароль!');
    return await this.createAndExistTokens(user, agent)
  }

  async refreshToken(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({ where: { token: refreshToken } })
    if (!token) { throw new UnauthorizedException() }
    await this.prismaService.token.delete({ where: { token: refreshToken } })
    if (new Date(token.exp) < new Date()) { throw new UnauthorizedException() }
    const user = await this.userService.findOneById(token.userId)
    return await this.createAndExistTokens(user, agent)
  }

  private async createAndExistTokens(user: User, agent: string): Promise<Tokens> {
    const tokens = await this.generateTokens(user, agent)
    if (!tokens) throw new BadRequestException()
    return tokens
  }


  private async generateTokens(user: User, agent: string) {
    const accessToken = "Bearer " + this.jwtService.sign({ id: user.id, email: user.email })
    const refreshToken = await this.getRefreshToken(user.id, agent)
    return { accessToken, refreshToken }
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({ where: { userId, userAgent: agent } })
    const token = _token?.token ?? ""
    return await this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: +this.configService.get("REFRESH_JWT_EXPIRATION_TIME") }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: +this.configService.get("REFRESH_JWT_EXPIRATION_TIME") }),
        userId,
        userAgent: agent
      }
    })
  }

}