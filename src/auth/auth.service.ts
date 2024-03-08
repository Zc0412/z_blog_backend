import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CodeLoginDto, LoginDto } from './dto/login.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  comparePasswords,
  hashPassword,
} from '../shared/utils/bcryptHash.util';
import { MailService } from '../shared/mail/mail.service';
import { MailDto } from '../shared/mail/dto/mail.dto';
import { EMAIL_CODE_REDIS_CACHE_TIME } from '../shared/config/constant';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private mailService: MailService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   * 验证码登录
   * @param codeLoginDto
   */
  async codeLogin(codeLoginDto: CodeLoginDto) {
    // 是否存在邮箱
    const hasEmail = await this.findUniqueEmail(codeLoginDto.email);
    if (!hasEmail) {
      throw new NotFoundException('邮箱不存在');
    }
    // 是否存在验证码
    const hasCode = await this.redis.get(codeLoginDto.email);
    if (!hasCode) {
      throw new NotFoundException('验证码已过期');
    }
    // 校验验证码是否正确
    if (hasCode !== codeLoginDto.code) {
      throw new NotFoundException('验证码错误');
    }
    const { password, ...userInfo } = hasEmail;
    // 生成token
    const accessToken = await this.certificate(userInfo.id);
    return { accessToken, ...userInfo };
  }

  /**
   * 登录
   * @param loginDto
   */
  async login(loginDto: LoginDto) {
    // 校验邮箱
    const hasEmail = await this.findUniqueEmail(loginDto.email);
    if (!hasEmail) {
      throw new NotFoundException('邮箱或密码不正确');
    }
    // 校验密码
    const _comparePasswords = await comparePasswords(
      loginDto.password,
      hasEmail.password,
    );
    if (!_comparePasswords) {
      throw new NotFoundException('邮箱或密码不正确');
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
  async findUniqueEmail(email: string): Promise<Prisma.UserCreateInput> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  /**
   * 生成token
   * @param id
   */
  async certificate(id: string): Promise<string> {
    const payload = { sub: id };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * 邮箱验证码服务
   * @param mailDto
   */
  async mailCode(mailDto: Pick<MailDto, 'email'>) {
    const hasEmail = await this.findUniqueEmail(mailDto.email);
    if (!hasEmail) {
      throw new NotFoundException('邮箱不存在');
    }
    // 生成随机验证码
    const mailCode = Math.random().toString().slice(2, 8);
    // 存储在redis中 设置缓存时间为5分钟
    const res = await this.redis.set(
      mailDto.email,
      mailCode,
      'EX',
      EMAIL_CODE_REDIS_CACHE_TIME,
    );
    console.log(res);
    console.log('MAIL_CODE:', mailCode);
    const _mailDto = { ...mailDto, mailCode };
    return await this.mailService.sendMail(_mailDto);
  }
}
