import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentDto } from './dto';
import { JwtPayload } from '@auth/types';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '@users/users.service';
import { ColumnService } from '@column/column.service';
import { CardService } from 'src/card/card.service';

@Injectable()
export class CommentsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly columnService: ColumnService,
    private readonly cardService: CardService) { }

  async create(user: JwtPayload, dto: CommentDto, columnId: string, cardId: string) {
    try {
      const exist = await this.existingForComment(user.id, columnId, cardId)
      if (exist === false) { throw new BadRequestException('Нет доступа!'); }
      const comment = await this.prisma.comments.create({ data: { text: dto.text, name: user.username, userId: user.id, cardId } })
      return comment
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка создания комментария!`, HttpStatus.FORBIDDEN);
    }
  }

  async findForCard(user: JwtPayload, columnId: string, cardId: string) {
    try {
      await this.existingForComment(user.id, columnId, cardId)
      const data = await this.prisma.comments.findMany({ where: { userId: user.id }, select: { id: true, name: true, text: true, userId: true } })
      return { data }
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения комментариев!`, HttpStatus.FORBIDDEN);
    }
  }

  async findUser(userId: string) {
    try {
      const userExist = await this.userService.findOne(userId)
      if (!userExist) { throw new BadRequestException('Нет доступа!'); }
      const data = await this.prisma.comments.findMany({ where: { userId }, select: { id: true, name: true, text: true, cardId: true } })
      return { data }
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка получения комментариев!`, HttpStatus.FORBIDDEN);
    }
  }

  async update(user: JwtPayload, columnId: string, cardId: string, id: string, data: CommentDto) {
    try {
      await this.existingForComment(user.id, columnId, cardId)
      return await this.prisma.comments.update({ where: { userId: user.id, cardId, id }, data })
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка обновления комментария!`, HttpStatus.FORBIDDEN);
    }
  }

  async remove(userId: string, columnId: string, cardId: string, id: string) {
    try {
      await this.existingForComment(userId, columnId, cardId)
      return await this.prisma.comments.delete({ where: { id }, select: { id: true } });
    } catch (error) {
      throw new HttpException(`Произошла неожиданная ошибка удаления комментария!`, HttpStatus.FORBIDDEN);
    }
  }

  private async existingForComment(userId: string, columnId: string, cardId: string) {
    const userExist = await this.userService.findOne(userId)
    if (!userExist) { throw new BadRequestException('Нет доступа!'); }
    const columnExist = await this.columnService.findOne(userId, columnId)
    if (!columnExist) { throw new BadRequestException('Нет доступа!'); }
    const cardExist = await this.cardService.findOne(userId, columnId, cardId)
    if (!cardExist) { throw new BadRequestException('Нет доступа!'); }
    return true
  }
}
