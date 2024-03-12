import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { excludeFieldsFromObjectsArray } from '../shared/utils/excludeField';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const pageSize = 10;
    const page = 1;
    const skip = (page - 1) * pageSize;
    const users = await this.prismaService.user.findMany({
      skip: skip,
      take: pageSize,
    });
    const totalItems = await this.prismaService.user.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    const items = excludeFieldsFromObjectsArray(users, ['password']);
    console.log(totalItems);
    return {
      data: items,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
