import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/tag.dto';

@ApiTags('标签')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({
    summary: '创建标签',
  })
  @ApiBearerAuth()
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @ApiOperation({ summary: '查找所有tag' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @ApiOperation({
    summary: '删除tag',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(id);
  }
}
