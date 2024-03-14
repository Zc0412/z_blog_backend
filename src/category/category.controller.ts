import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '创建分类',
  })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: '查找所有分类',
  })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiOperation({
    summary: '更新分类',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: '删除分类',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
