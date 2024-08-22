import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CardDto } from './dto/card.dto';
import { PrismaService } from '@prisma/prisma.service';
import { ColumnService } from '@column/column.service';
import { OrderDto } from './dto';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Card } from '@prisma/client';
import { converToSeconds } from '@common/utils';

@Injectable()
export class CardService {

  constructor(private readonly prisma: PrismaService, private readonly columnService: ColumnService, @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService) { }

  async create(userId: string, dto: CardDto, columnId: string) {
    try {
      const columnExist = await this.columnService.findOne(userId, columnId)
      if (!columnExist) { throw new BadRequestException('Нет доступа!'); }
      const order = await this.prisma.card.count({ where: { columnId } })
      return this.prisma.card.create({ data: { text: dto.text, columnId, order }, select: { id: true, text: true, order: true, columnId: true } })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка создания карточки!`, HttpStatus.FORBIDDEN);
    }
  }

  async findAll(userId: string, columnId: string) {
    try {
      const userExist = await this.columnService.findOne(userId, columnId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      const data = await this.prisma.card.findMany({
        where: { columnId },
        select: {
          id: true, text: true, order: true, columnId: true,
          comments: { select: { id: true, name: true, text: true, userId: true } }
        }
      })
      return { data }
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения карточек!`, HttpStatus.FORBIDDEN);
    }
  }

  async findOne(userId: string, columnId: string, id: string) {
    try {
      const userExist = await this.columnService.findOne(userId, columnId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }

      const card = await this.cacheManager.get<Card>(id)
      if (!card) {
        const card = await this.prisma.card.findUnique({
          where: { id }, select: {
            id: true, text: true, order: true, columnId: true,
            comments: { select: { id: true, name: true, text: true, userId: true } }
          }
        })
        if (!card) { throw new NotFoundException() }
        await this.cacheManager.set(id, card, converToSeconds(this.configService.get("COLUMN_EXPIRATION_TIME")))
        return card
      }
      return card
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения карточки!`, HttpStatus.FORBIDDEN);
    }
  }

  async update(userId: string, columnId: string, id: string, data: CardDto) {
    try {
      const userExist = await this.columnService.findOne(userId, columnId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.card.update({ where: { id }, data, select: { id: true, text: true, order: true, columnId: true } })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка обновления карточки!`, HttpStatus.FORBIDDEN);
    }
  }

  async remove(userId: string, columnId: string, id: string) {
    try {
      const userExist = await this.columnService.findOne(userId, columnId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.card.delete({ where: { id }, select: { id: true } })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка удаления карточки!`, HttpStatus.FORBIDDEN);
    }
  }

  async updateOrder(dto: OrderDto, userId: string, columnId: string) {
    try {
      const userExist = await this.columnService.findOne(userId, columnId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      return await this.prisma.$transaction(
        dto.ids.map((id, order) => this.prisma.card.update({
          where: { id },
          data: { order },
          select: { id: true, text: true, order: true, columnId: true }
        }))
      )
    } catch (error) {
      throw new HttpException(`Произошла ошибка обновления порядка статуса проекта!`, HttpStatus.FORBIDDEN);
    }
  }
}
