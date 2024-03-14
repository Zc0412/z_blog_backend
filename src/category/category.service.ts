import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  /**
   * 创建分类
   * @param createCategoryDto
   */
  async create(createCategoryDto: CreateCategoryDto) {
    // 查询category是否存在
    const category = await this.prismaService.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    // 判断分类是否已经创建
    if (category) {
      throw new NotFoundException('category 已存在');
    }
    return this.prismaService.category.create({
      data: createCategoryDto,
    });
  }

  /**
   * 查找所有分类
   */
  async findAll() {
    return await this.prismaService.category.findMany();
  }

  /**
   * 更新分类
   * @param id
   * @param updateCategoryDto
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('category不存在');
    }
    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * 删除分类
   * @param id
   */
  async remove(id: string) {
    // 校验分类是否存在
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('category不存在');
    }
    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
