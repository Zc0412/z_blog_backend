import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Ip,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SkipAuth } from '../shared/decorator/auth.decorator';

@ApiTags('评论区')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: '添加评论',
  })
  @SkipAuth()
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    return this.commentService.create(createCommentDto);
  }

  @ApiOperation({
    summary: '查询文章所有评论',
  })
  @SkipAuth()
  @Get(':postId')
  findAll(@Param('id') id: string) {
    return this.commentService.findAll(id);
  }

  @ApiOperation({
    summary: '删除评论',
  })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
