import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import {
  excludeFieldsFromObject,
  excludeFieldsFromObjectsArray,
} from '../shared/utils/excludeField';
import { FindUsersDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(createUserDto) {
    return 'This action adds a new user';
  }

  /**
   * 查询所有用户
   * @param findUsersDto
   */
  async findAll(findUsersDto: FindUsersDto) {
    const { page, pageSize } = findUsersDto;
    // 跳过的数据
    const skip = (page - 1) * pageSize;
    const users = await this.prismaService.user.findMany({
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
    // 用户数据
    const items = excludeFieldsFromObjectsArray(users, ['password']);
    // 总条数
    const totalItems = await this.prismaService.user.count();
    // 总页数
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data: items,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
      },
    };
  }

  /**
   * 查询用户信息
   * @param id
   */
  async findOne(id: string) {
    return await this.findUniqueId(id);
  }

  /**
   * 删除用户
   * @param id
   */
  async remove(id: string) {
    await this.findUniqueId(id);
    return await this.prismaService.user.delete({
      where: { id },
    });
  }

  /**
   * 查询用户id是否存在
   * @param id
   */
  async findUniqueId(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return excludeFieldsFromObject(user, ['password']);
  }
}
