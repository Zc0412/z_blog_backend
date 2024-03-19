import { Injectable, NotFoundException } from '@nestjs/common';
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

  /**
   * 依据post ID查询所有comment
   */
  async findAll(id: string) {
    console.log(id);
    return this.prismaService.comment.findMany({
      where: {
        postId: id,
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true, // 嵌套包含子评论的子评论
            // 可以根据需要继续嵌套更多层级
          },
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
