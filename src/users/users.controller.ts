import { Controller, Get, Body, Patch, Delete, UsePipes, ValidationPipe, HttpStatus, HttpCode, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { DeleteMessage, UpdateUsersResponse, UserResponse } from './types';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/types';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /*
  @ApiOkResponse({ type: UserResponse })
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() dto: UserDto) {
    return this.usersService.create(dto)
  }
  */

  @ApiOkResponse({ type: UserResponse })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findOne(@CurrentUser("id") id: string) {
    const { password, ...profile } = await this.usersService.findOneById(id);
    return profile
  }

  @ApiBody({ type: UserDto })
  @ApiOkResponse({ type: UpdateUsersResponse })
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Patch()
  async update(@CurrentUser("id") id: string, @Body() dto: UserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOkResponse({ type: DeleteMessage })
  @HttpCode(HttpStatus.OK)
  @Delete()
  async remove(@CurrentUser("id") id: string) {
    return this.usersService.remove(id);
  }
}
