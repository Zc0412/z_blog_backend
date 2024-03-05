import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '必须包含数字、字母、大写字母、特殊字符',
  })
  password: string;

  @IsString()
  @Match('password', { message: '密码不一致' })
  passwordConfirm: string;
}
