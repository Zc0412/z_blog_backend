import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 邮箱验证码
export class EmailCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
