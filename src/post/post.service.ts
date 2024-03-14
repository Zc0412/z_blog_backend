import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

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
      include: { tags: true, author: true, category: true },
    });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
