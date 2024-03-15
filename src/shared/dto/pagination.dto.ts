import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// 分页
export class PaginationDto {
  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  // @Transform(({ value }) => parseInt(value)) 转换number类型 方式一
  page: number;

  @ApiProperty()
  @Min(10)
  @Max(50)
  @IsNumber()
  // @Type(() => Number) 转换number类型 方式二
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize: number;
}
