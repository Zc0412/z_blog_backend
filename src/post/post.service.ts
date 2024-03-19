import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { FindPostDto } from './dto/find-post.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  /**
   * 创建博客文章
   * @param createPostDto
   */
  async create(createPostDto: CreatePostDto) {
    const { tags, ...other } = createPostDto;
    return this.prismaService.post.create({
      data: {
        ...other,
        tags: {
          connect: tags.map((tagId) => ({ id: tagId })),
        },
      },
    });
  }

  /**
   * 查询所有博客文章
   */
  async findAll(findPostDto: FindPostDto) {
    const { page, pageSize } = findPostDto;
    // 跳过的数据
    const skip = (page - 1) * pageSize;
    const items = await this.prismaService.post.findMany({
      skip: skip,
      take: pageSize,
      include: { tags: true, category: true },
    });
    // 总条数
    const totalItems = await this.prismaService.post.count();
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
   * 查询博客文章
   * @param id
   */
  async findOne(id: string) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });
    // 校验是否存在
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    // 阅读数+1
    return this.prismaService.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        tags: true,
        category: true,
        author: { select: { id: true, userName: true } },
        visits: true,
      },
    });
  }

  /**
   * 更新post
   * @param id
   * @param updatePostDto
   */
  async update(id: string, updatePostDto: Omit<UpdatePostDto, 'authorId'>) {
    // 校验post是否存在
    const hasPost = await this.prismaService.post.findUnique({
      where: { id },
    });
    if (!hasPost) {
      throw new NotFoundException('文章不存在');
    }
    const { tags, ...other } = updatePostDto;
    // 跟新post
    return this.prismaService.post.update({
      where: { id },
      data: {
        ...other,
        tags: {
          connect: tags.map((tagId) => ({ id: tagId })),
        },
      },
    });
  }

  /**
   * 删除博客文章
   * @param id
   */
  async remove(id: string) {
    const hasPost = await this.prismaService.post.findUnique({
      where: { id },
    });
    if (!hasPost) {
      throw new NotFoundException('文章不存在');
    }
    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
