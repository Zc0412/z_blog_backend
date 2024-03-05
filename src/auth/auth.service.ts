import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../shared/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  /**
   * 生成token
   * @param user
   */
  async certificate(user): Promise<string> {
    const payload = { name: user.userName };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * 登录
   * @param loginDto
   */
  async login(loginDto: LoginDto) {
    const accessToken = await this.certificate(loginDto);
    return {
      accessToken,
    };
  }

  /**
   * 注册
   * @param registerDto
   */
  async register(registerDto: Prisma.UserCreateInput) {
    const user = await this.prismaService.user.create({
      // data: {},
    });
    const accessToken = await this.certificate(registerDto);
    return {
      accessToken,
    };
  }
}
