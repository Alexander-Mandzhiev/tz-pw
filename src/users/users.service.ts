import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '@prisma/prisma.service';
import { genSalt, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {


  constructor(private prisma: PrismaService) { }

  async create(dto: UserDto) {
    const hashPassword = this.passwordHash(dto.password)
    return await this.prisma.user.create({ data: { username: '', email: dto.email, password: hashPassword } });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, dto: UserDto) {
    let data = dto;
    const hashPassword = this.passwordHash(data.password)
    if (dto.password) { data = { ...dto, password: hashPassword } }
    return await this.prisma.user.update({ where: { id }, data, select: { username: true, email: true } })
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleteUser = await this.prisma.user.delete({ where: { id } });
    return { message: 'Пользователь успешно удален!' };
  }

  private passwordHash(password: string) {
    return hashSync(password, genSaltSync(15))
  }
}
