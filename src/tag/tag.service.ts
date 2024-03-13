import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prismaService: PrismaService) {}
  async create(createTagDto: CreateTagDto) {
    await this.findUniqueTag(createTagDto.name);
    return this.prismaService.tag.create({ data: createTagDto });
  }

  findAll() {
    return `This action returns all tag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }

  // 查询tag是否存在
  async findUniqueTag(name: string) {
    const tag = this.prismaService.tag.findUnique({
      where: { name },
    });
    if (!tag) {
      throw new NotFoundException('name已存在');
    }
    return tag;
  }
}
