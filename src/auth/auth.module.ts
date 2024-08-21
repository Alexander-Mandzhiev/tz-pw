import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { options } from '@auth/config';
import { UsersModule } from '@users/users.module';
import { UsersService } from '@users/users.service';
import { STRATEGIES } from './strategy';
import { GUARDS } from './guards';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync(options())
  ],
  controllers: [AuthController,],
  providers: [AuthService, UsersService, ...STRATEGIES, ...GUARDS]
})
export class AuthModule { }