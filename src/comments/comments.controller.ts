import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ValidationPipe, UsePipes, HttpCode } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/types';
import { AllCardCommentsResponse, AllUserCommentsResponse, CreateCommentResponse, DeleteResponse } from './types';

@ApiTags("Comments")
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @ApiOperation({ summary: 'Создание комментария' })
  @ApiBody({ type: CommentDto })
  @ApiResponse({ status: 200, description: "Создание карточки", type: CreateCommentResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post(":column_id/:card_id")
  async create(@CurrentUser() userId: JwtPayload, @Body() dto: CommentDto, @Param('column_id') columnId: string, @Param('card_id') cardId: string) {
    return this.commentsService.create(userId, dto, columnId, cardId);
  }

  @ApiOperation({ summary: 'Получить все комментарии пользователя' })
  @ApiResponse({ status: 200, description: "Получить все комментарии пользователя", type: AllUserCommentsResponse })
  @HttpCode(HttpStatus.OK)
  @Get("user")
  async findUser(@CurrentUser("id") user: string) {
    return this.commentsService.findUser(user);
  }

  @ApiOperation({ summary: 'Получить все комментарии карточки' })
  @ApiResponse({ status: 200, description: "Получить все комментарии карточки", type: AllCardCommentsResponse })
  @HttpCode(HttpStatus.OK)
  @Get(":column_id/:card_id")
  async findForCard(@CurrentUser() user: JwtPayload, @Param('column_id') columnId: string, @Param('card_id') cardId: string) {
    return this.commentsService.findForCard(user, columnId, cardId);
  }

  @ApiOperation({ summary: 'Обновление комментария' })
  @ApiBody({ type: CommentDto })
  @ApiResponse({ status: 200, description: "Обновление карточки", type: CreateCommentResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(":column_id/:card_id/:id")
  async update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: CommentDto, @Param('column_id') columnId: string, @Param('card_id') cardId: string) {
    return this.commentsService.update(user, columnId, cardId, id, dto);
  }

  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiResponse({ status: 200, description: "Удаление комментария", type: DeleteResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(":column_id/:card_id/:id")
  async remove(@CurrentUser("id") user: string, @Param('id') id: string, @Param('column_id') columnId: string, @Param('card_id') cardId: string) {
    return this.commentsService.remove(user, columnId, cardId, id);
  }
}
