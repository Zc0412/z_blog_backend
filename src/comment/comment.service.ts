import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  /**
   * 添加评论
   * @param createCommentDto
   */
  async create(createCommentDto: CreateCommentDto) {
    // 评论校验文章是否存在
    const hasPost = await this.prismaService.post.findUnique({
      where: { id: createCommentDto.postId },
    });
    if (!hasPost) {
      throw new NotFoundException('文章不存在');
    }
    return this.prismaService.comment.create({
      data: createCommentDto,
    });
  }

  findAll() {
    return `This action returns all comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
