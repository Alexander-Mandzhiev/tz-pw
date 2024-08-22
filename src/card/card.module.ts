import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { ColumnService } from '@column/column.service';
import { UsersService } from '@users/users.service';

@Module({
  controllers: [CardController],
  providers: [CardService, ColumnService, UsersService],
  exports: [CardService]
})
export class CardModule { }
