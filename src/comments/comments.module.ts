import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersService } from '@users/users.service';
import { CardService } from 'src/card/card.service';
import { ColumnService } from '@column/column.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, UsersService, ColumnService, CardService],
})
export class CommentsModule { }
