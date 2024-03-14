import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/tag.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}

  /**
   * 创建tag
   * @param createTagDto
   */
  async create(createTagDto: CreateTagDto) {
    const tag = await this.prismaService.tag.findUnique({
      where: { name: createTagDto.name },
    });
    if (tag) {
      throw new NotFoundException('name已存在');
    }
    return this.prismaService.tag.create({ data: createTagDto });
  }

  /**
   * 查询所有tag
   */
  async findAll() {
    return this.prismaService.tag.findMany();
  }

  /**
   * 删除tag
   * @param id
   */
  async remove(id: string) {
    // 查找id是否存在
    const tag = await this.prismaService.tag.findUnique({
      where: {
        id,
      },
    });
    if (!tag) {
      throw new NotFoundException('tag不存在');
    }
    // 删除tag
    return this.prismaService.tag.delete({
      where: { id },
    });
  }
}
