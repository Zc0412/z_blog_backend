import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CodeLoginDto, ImageCodeLoginDto, LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../shared/decorator/auth.decorator';
import { EmailCodeDto } from './dto/loginCode.dto';
import { GithubAuthGuard } from '../shared/github/github.guard';

@ApiTags('鉴权')
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * github登录
   * @param req
   */
  @Get('github')
  @UseGuards(GithubAuthGuard)
  async githubLogin(@Req() req) {
    // 会被重定向到github
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req) {
    const user = req.user;
    const password = '123456';
    const registerDto: Omit<RegisterDto, 'passwordConfirm'> = {
      userName: user.username,
      email: user._json.email,
      password,
      avatar: user._json.avatar_url,
    };
    // 注册github账号
    return await this.authService.register(registerDto);
  }

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
  @Post('emailCodeLogin')
  async verificationEmailCodeLogin(@Body() codeLoginDto: CodeLoginDto) {
    return this.authService.codeLogin(codeLoginDto);
  }

  // 图片验证码登录
  @Post('imageCodeLogin')
  async verificationImageCodeLogin(
    @Body() imageCodeLoginDto: ImageCodeLoginDto,
  ) {
    return await this.authService.imageCodeLogin(imageCodeLoginDto);
  }

  // 获取验证码
  @Get('loginCode')
  async sendEmail(@Query() emailCodeDto: EmailCodeDto) {
    return await this.authService.mailCode(emailCodeDto);
  }

  // 获取图片验证码
  @Get('imageCode')
  async imageVerificationCode(@Res() response: Response) {
    const captchaSvg = await this.authService.svgCaptcha();
    response.type('image/svg+xml'); // 设置正确的 Content-Type
    response.send(captchaSvg); // 发送 SVG 字符串
  }
}
