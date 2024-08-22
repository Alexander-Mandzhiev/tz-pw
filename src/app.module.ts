import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { ColumnModule } from './column/column.module';
import { CardModule } from './card/card.module';
import { CommentsModule } from './comments/comments.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    UsersModule,
    AuthModule,
    PrismaModule,
    ColumnModule,
    CardModule,
    CommentsModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule { }
