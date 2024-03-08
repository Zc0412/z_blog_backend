import { IsEmail, IsString, Matches } from 'class-validator';
import { mailCodeReg } from '../../utils/reg.util';
import { ApiProperty } from '@nestjs/swagger';

export class MailDto {
  @ApiProperty()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsString()
  text?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(mailCodeReg, { message: '请输入6位验证码' })
  mailCode: string;
}
