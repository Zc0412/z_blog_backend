import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { mailCodeReg, passwordReg } from '../../shared/utils/reg.util';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(passwordReg, {
    message: '密码必须包含数字、小写字母、大写字母',
  })
  password: string;
}

// 邮箱验证码登录
export class CodeLoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(mailCodeReg, { message: '请输入6位验证码' })
  code: string;
}

// 图片验证码
export class ImageCodeLoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  code: string;
}
