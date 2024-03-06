import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from '../decorator/match.decorator';
import { passwordReg } from '../../shared/utils/reg.util';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(passwordReg, {
    message: '必须包含数字、小写字母、大写字母',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @Match('password', { message: '密码不一致' })
  passwordConfirm: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar?: string;
}
