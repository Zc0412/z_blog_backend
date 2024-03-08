import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CodeLoginDto, LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../shared/decorator/auth.decorator';
import { EmailCodeDto } from './dto/emailCode.dto';

@ApiTags('鉴权')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 注册
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() register: RegisterDto) {
    const { passwordConfirm, ...registerDataWithOutPasswordConfirm } = register;
    // 默认头像
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${registerDataWithOutPasswordConfirm.email}`;
    return await this.authService.register({
      ...registerDataWithOutPasswordConfirm,
      avatar,
    });
  }

  // 密码登录
  @ApiBody({ type: LoginDto, description: '登录' })
  @Post('login')
  async login(@Body() login: LoginDto) {
    return await this.authService.login(login);
  }

  // 验证码登录
  @Post('codeLogin')
  async verificationCodeLogin(@Body() codeLoginDto: CodeLoginDto) {
    return this.authService.codeLogin(codeLoginDto);
  }

  // 获取验证码
  @Get('loginCode')
  async sendEmail(@Query() emailCodeDto: EmailCodeDto) {
    return await this.authService.mailCode(emailCodeDto);
  }
}
