import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  comparePasswords,
  hashPassword,
} from '../shared/utils/bcryptHash.util';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  /**
   * 登录
   * @param loginDto
   */
  async login(loginDto: LoginDto) {
    // 校验邮箱
    const hasEmail = await this.findUniqueEmail(loginDto.email);
    if (!hasEmail) {
      throw new NotFoundException('邮箱不存在');
    }
    // 校验密码
    const _comparePasswords = await comparePasswords(
      loginDto.password,
      hasEmail.password,
    );
    if (!_comparePasswords) {
      throw new NotFoundException('密码错误');
    }
    const { password, ...userInfo } = hasEmail;
    // 生成token
    const accessToken = await this.certificate(userInfo.id);
    return { accessToken, ...userInfo };
  }

  /**
   * 注册
   * @param registerDto
   */
  async register(registerDto: Prisma.UserCreateInput) {
    const { password: _password, ...registerDtoWithoutPassword } = registerDto;
    // 校验邮箱是否 唯一
    const hasEmail = await this.findUniqueEmail(registerDto.email);
    if (hasEmail) {
      throw new NotFoundException('邮箱已存在');
    }
    // 加密
    const _hashPassword = await hashPassword(_password);
    // 注册
    const { password, ...userInfo } = await this.prismaService.user.create({
      data: { password: _hashPassword, ...registerDtoWithoutPassword },
    });
    // token
    const accessToken = await this.certificate(userInfo.id);
    return {
      accessToken,
      ...userInfo,
    };
  }

  /**
   * 查找邮箱是否存在
   * @param email
   */
  async findUniqueEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  /**
   * 生成token
   * @param id
   */
  async certificate(id: string): Promise<string> {
    const payload = { id };
    return await this.jwtService.signAsync(payload);
  }
}
