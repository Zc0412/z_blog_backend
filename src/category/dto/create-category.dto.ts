import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 创建分类
export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
