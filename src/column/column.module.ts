import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { UsersService } from '@users/users.service';

@Module({
  controllers: [ColumnController],
  providers: [ColumnService, UsersService],
  exports: [ColumnService]
})
export class ColumnModule { }
