import { IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// 查询用户
export class FindUsersDto {
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

// 查询单个用户
export class FindOne {
  @IsString()
  id: string;
}
