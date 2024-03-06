import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('鉴权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() register: RegisterDto) {
    const { passwordConfirm, ...registerDataWithOutPasswordConfirm } = register;
    // 默认头像
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${registerDataWithOutPasswordConfirm.email}`;
    return this.authService.register({
      ...registerDataWithOutPasswordConfirm,
      avatar,
    });
  }

  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }
}
