import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ColumnDto, OrderDto } from './dto';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '@users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Column } from '@prisma/client';
import { Cache } from 'cache-manager';
import { converToSeconds } from '@common/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ColumnService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService) { }

  async create(userId: string, dto: ColumnDto) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      const order = await this.prisma.column.count({ where: { userId } })
      return this.prisma.column.create({ data: { title: dto.title, description: dto.description, userId, order } })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка создания колонки!`, HttpStatus.FORBIDDEN);
    }
  }

  async findAll(userId: string) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      const data = await this.prisma.column.findMany({ where: { userId }, select: { id: true, title: true, description: true, order: true, cards: { select: { id: true, text: true, order: true } } } })
      return { data }
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения колонок!`, HttpStatus.FORBIDDEN);
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }

      const column = await this.cacheManager.get<Column>(id)
      if (!column) {
        const column = await this.prisma.column.findUnique({ where: { userId, id }, select: { id: true, title: true, description: true, order: true, cards: { select: { id: true, text: true, order: true } } } })
        if (!column) { throw new NotFoundException() }
        await this.cacheManager.set(id, column, converToSeconds(this.configService.get("COLUMN_EXPIRATION_TIME")))
        return column
      }
      return column
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения колонки!`, HttpStatus.FORBIDDEN);
    }
  }

  async update(userId: string, id: string, data: ColumnDto) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.column.update({ where: { userId, id }, data, select: { id: true, title: true, description: true, order: true } })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка обновления колонки!`, HttpStatus.FORBIDDEN);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.column.delete({ where: { id: id, userId }, select: { id: true } });
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка удаления колонки!`, HttpStatus.FORBIDDEN);

    }
  }

  async updateOrder(dto: OrderDto, userId: string) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.$transaction(
        dto.ids.map((id, order) => this.prisma.column.update({
          where: { id },
          data: { order },
          select: { id: true, title: true, description: true, order: true }
        }))
      )
    } catch (error) {
      throw new HttpException(`Произошла ошибка обновления порядка статуса проекта!`, HttpStatus.FORBIDDEN);
    }
  }
}

