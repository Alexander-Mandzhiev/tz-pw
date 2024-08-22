import { Controller, Get, Body, Patch, Delete, UsePipes, ValidationPipe, HttpStatus, HttpCode, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteMessage, UpdateUsersResponse, UserResponse } from './types';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/types';

@ApiTags("Users")
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /*
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiOkResponse({ type: UserResponse })
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() dto: UserDto) {
    return this.usersService.create(dto)
  }
  */

  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({ status: 200, description: "Получить профиль пользователя", type: UserResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findOne(@CurrentUser("id") id: string) {
    const { password, ...profile } = await this.usersService.findOne(id);
    return profile
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: "Обновить профиль пользователя", type: UpdateUsersResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(@CurrentUser("id") id: string, @Body() dto: UserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Удалить профиль пользователя' })
  @ApiResponse({ status: 200, description: "Удалить профиль пользователя", type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete()
  async remove(@CurrentUser() user: JwtPayload) {
    return this.usersService.remove(user);
  }
}
