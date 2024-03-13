import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 创建tag
export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
