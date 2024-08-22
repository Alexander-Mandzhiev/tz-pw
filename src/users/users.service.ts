import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { converToSeconds } from '@common/utils';
import { JwtPayload } from '@auth/types';

@Injectable()
export class UsersService {


  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) { }

  async create(dto: UserDto) {
    const hashPassword = this.passwordHash(dto.password)
    return await this.prisma.user.create({ data: { username: '', email: dto.email, password: hashPassword } });
  }

  async findOne(value: string, isReset = false) {
    if (isReset) {
      await this.cacheManager.del(value)
    }
    const user = await this.cacheManager.get<User>(value)
    if (!user) {
      const casheUser = await this.prisma.user.findFirst({ where: { OR: [{ id: value }, { email: value }] }, });
      if (!casheUser) { throw new NotFoundException() }
      await this.cacheManager.set(value, casheUser, converToSeconds(this.configService.get("ACCESS_JWT_EXPIRATION_TIME")))
      return casheUser
    }
    return user
  }


  async update(id: string, dto: UserDto) {
    let data = dto;
    const hashPassword = this.passwordHash(data.password)
    if (dto.password) { data = { ...dto, password: hashPassword } }
    return await this.prisma.user.update({ where: { id }, data, select: { username: true, email: true } })
  }

  async remove(user: JwtPayload): Promise<{ message: string }> {
    const deleted = await this.prisma.user.delete({ where: { id: user.id }, select: { id: true } });
    await Promise.all([this.cacheManager.del(user.id), this.cacheManager.del(user.email)])
    return { message: `Пользователь с ID = ${deleted.id} успешно удален!` };
  }

  private passwordHash(password: string) {
    return hashSync(password, genSaltSync(15))
  }
}
