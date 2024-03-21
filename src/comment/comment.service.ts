import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UAParser } from 'ua-parser-js';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  /**
   * 添加评论
   * @param createCommentDto
   */
  async create(createCommentDto: CreateCommentDto) {
    const { parentId, userAgent, ...other } = createCommentDto;
    // JsonObject
    const ua = UAParser(userAgent) as unknown as Prisma.JsonObject;
    // 评论校验文章是否存在
    const hasPost = await this.prismaService.post.findUnique({
      where: { id: createCommentDto.postId },
    });
    if (!hasPost) {
      throw new NotFoundException('文章不存在');
    }
    // 未传递父级ID，直接评论
    if (!parentId) {
      return this.prismaService.comment.create({
        data: { ...other, userAgent: ua },
      });
    } else {
      // 传递了父级ID，校验ID是否存在
      const hasParentId = await this.prismaService.comment.findFirst({
        where: { id: parentId },
      });
      if (!hasParentId) {
        throw new NotFoundException('未查询到该评论，无法添加子评论');
      }
      // 存在添加子评论
      return this.prismaService.comment.create({
        data: { ...other, parentId, userAgent: ua },
      });
    }
  }

  /**
   * 依据post ID查询所有comment
   */
  async findAll(id: string) {
    return this.prismaService.comment.findMany({
      where: {
        postId: id,
      },
    });
  }

  /**
   * 删除评论
   * @param id
   */
  async remove(id: string) {
    const hasComment = await this.prismaService.comment.findUnique({
      where: { id },
    });
    if (!hasComment) {
      throw new NotFoundException('评论不存在');
    }
    return this.prismaService.comment.delete({ where: { id } });
  }
}
