import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SkipAuth } from '../shared/decorator/auth.decorator';
import { FindPostDto } from './dto/find-post.dto';

@ApiTags('文章')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: '创建文章',
  })
  @ApiBearerAuth()
  @Post()
  create(
    @Body() createPostDto: Omit<CreatePostDto, 'authorId'>,
    @Req() req: Request,
  ) {
    // authGuard获取到authorId
    const authorId = req['authorId'];
    return this.postService.create({ ...createPostDto, authorId });
  }

  @ApiOperation({
    summary: '查询所有的博客文章',
  })
  @SkipAuth()
  @Get()
  async findAll(@Query() findPostDto: FindPostDto) {
    return this.postService.findAll(findPostDto);
  }

  @ApiOperation({
    summary: '查询博客文章',
  })
  @SkipAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
