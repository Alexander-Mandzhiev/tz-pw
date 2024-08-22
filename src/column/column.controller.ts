import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnDto, OrderDto } from './dto';
import { CurrentUser } from '@common/decorators';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ColumnResponse, DeleteResponse, GetAllColumns } from './types';

@ApiTags("Columns")
@ApiBearerAuth()
@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) { }

  @ApiOperation({ summary: 'Создание колонки' })
  @ApiBody({ type: ColumnDto })
  @ApiResponse({ status: 200, description: "Создание колонки", type: ColumnResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@CurrentUser("id") userId: string, @Body() dto: ColumnDto) {
    return this.columnService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Получить все колонки' })
  @ApiResponse({ status: 200, description: "Получить все колонки", type: GetAllColumns })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@CurrentUser("id") userId: string) {
    return this.columnService.findAll(userId);
  }

  @ApiOperation({ summary: 'Обновить порядок колонок' })
  @ApiBody({ type: OrderDto })
  @ApiResponse({ status: 200, description: "Получить все колонки", type: GetAllColumns })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(`order`)
  async updateOrder(@Body() dto: OrderDto, @CurrentUser("id") userId: string) {
    return this.columnService.updateOrder(dto, userId);
  }

  @ApiOperation({ summary: 'Получить одну колонку' })
  @ApiResponse({ status: 200, description: "Получить одну колонку", type: ColumnResponse })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@CurrentUser("id") userId: string, @Param('id') id: string) {
    return this.columnService.findOne(userId, id);
  }

  @ApiOperation({ summary: 'Обновление колонки' })
  @ApiBody({ type: ColumnDto })
  @ApiResponse({ status: 200, description: "Обновление колонки", type: ColumnResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@CurrentUser("id") userId: string, @Param('id') id: string, @Body() dto: ColumnDto) {
    return this.columnService.update(userId, id, dto);
  }

  @ApiOperation({ summary: 'Удаление колонки' })
  @ApiResponse({ status: 200, description: "Удаление колонки", type: DeleteResponse })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@CurrentUser("id") userId: string, @Param('id') id: string) {
    return this.columnService.remove(userId, id);
  }
}
