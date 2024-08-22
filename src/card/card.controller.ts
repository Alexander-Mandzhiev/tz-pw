import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, HttpCode, HttpStatus } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CardResponse, DeleteResponse, GetAllCardForColumn } from './types';
import { CurrentUser } from '@common/decorators';
import { OrderDto } from './dto';

@ApiTags("Cards")
@ApiBearerAuth()
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @ApiOperation({ summary: 'Создание карточки' })
  @ApiBody({ type: CardDto })
  @ApiResponse({ status: 200, description: "Создание карточки", type: CardResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post(":column_id")
  async create(@CurrentUser("id") userId: string, @Body() dto: CardDto, @Param('column_id') columnId: string) {
    return this.cardService.create(userId, dto, columnId);
  }

  @ApiOperation({ summary: 'Получить все карточки колонки' })
  @ApiResponse({ status: 200, description: "Получить все колонки", type: GetAllCardForColumn })
  @HttpCode(HttpStatus.OK)
  @Get(":column_id")
  async findAll(@CurrentUser("id") userId: string, @Param('column_id') columnId: string) {
    return this.cardService.findAll(userId, columnId);
  }

  @ApiOperation({ summary: 'Обновить порядок карточек' })
  @ApiBody({ type: OrderDto })
  @ApiResponse({ status: 200, description: "Получить все колонки", type: GetAllCardForColumn })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(":column_id/order")
  async updateOrder(@Body() dto: OrderDto, @CurrentUser("id") userId: string, @Param('column_id') columnId: string) {
    return this.cardService.updateOrder(dto, userId, columnId);
  }

  @ApiOperation({ summary: 'Получить карточку колонки' })
  @ApiResponse({ status: 200, description: "Получить карточку колонки", type: CardResponse })
  @HttpCode(HttpStatus.OK)
  @Get(":column_id/:id")
  async findOne(@CurrentUser("id") userId: string, @Param('column_id') columnId: string, @Param('id') id: string) {
    return this.cardService.findOne(userId, columnId, id);
  }

  @ApiOperation({ summary: 'Обновление карточки' })
  @ApiBody({ type: CardDto })
  @ApiResponse({ status: 200, description: "Обновление карточки", type: CardResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(":column_id/:id")
  async update(@CurrentUser("id") userId: string, @Param('column_id') columnId: string, @Param('id') id: string, @Body() dto: CardDto) {
    return this.cardService.update(userId, columnId, id, dto);
  }

  @ApiOperation({ summary: 'Удаление карточки' })
  @ApiResponse({ status: 200, description: "Удаление карточки", type: DeleteResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(":column_id/:id")
  async remove(@CurrentUser("id") userId: string, @Param('column_id') columnId: string, @Param('id') id: string) {
    return this.cardService.remove(userId, columnId, id);
  }
}
