import { Injectable, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as svgCaptcha from 'svg-captcha';
import { HttpService } from '@nestjs/axios';
import { Prisma } from '@prisma/client';
import { CodeLoginDto, ImageCodeLoginDto, LoginDto } from './dto/login.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import {
  comparePasswords,
  hashPassword,
} from '../shared/utils/bcryptHash.util';
import { MailService } from '../shared/mail/mail.service';
import { MailDto } from '../shared/mail/dto/mail.dto';
import {
  EMAIL_CODE_REDIS_CACHE_TIME,
  IMAGE_CODE_REDIS_CACHE_TIME,
} from '../shared/config/constant';
import { AppLoggerService } from '../shared/winston/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private logger: AppLoggerService,
    private httpService: HttpService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private mailService: MailService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // 图片验证码登录
  async imageCodeLogin(imageCodeLoginDto: ImageCodeLoginDto) {
    // 是否存在邮箱
    const hasEmail = await this.findUniqueEmail(imageCodeLoginDto.email);
    if (!hasEmail) {
      throw new NotFoundException('邮箱不存在');
    }
    // 是否存在验证码
    const hasCode = await this.redis.get(imageCodeLoginDto.code);
    if (!hasCode) {
      throw new NotFoundException('验证码已过期');
    }
    // 校验验证码是否正确
    if (hasCode !== imageCodeLoginDto.code) {
      throw new NotFoundException('验证码错误');
    }
    const { password, ...userInfo } = hasEmail;
    // 生成token
    const accessToken = await this.certificate(userInfo.id);
    this.logger.info(null, `图片验证码登录:${userInfo.email}`);
    return { accessToken, ...userInfo };
  }

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
    this.logger.info(null, `邮箱验证码登录:${userInfo.email}`);
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
    this.logger.info(null, `账号密码登录:${userInfo.email}`);
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
    this.logger.info(null, `注册:${userInfo.email}`);
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
    await this.redis.set(
      mailDto.email,
      mailCode,
      'EX',
      EMAIL_CODE_REDIS_CACHE_TIME,
    );
    const _mailDto = { ...mailDto, mailCode };
    this.logger.info(null, `邮箱验证码:${mailCode}`);
    return await this.mailService.sendMail(_mailDto);
  }

  /**
   * 缓存和生成图片验证
   */
  async svgCaptcha() {
    const { svgCaptchaText, svgCaptchaData } = this.createSvgCaptcha();
    // redis缓存图片验证码
    await this.redis.set(
      svgCaptchaText,
      svgCaptchaText,
      'EX',
      IMAGE_CODE_REDIS_CACHE_TIME,
    );
    this.logger.info(null, `图片验证码:${svgCaptchaText}`);
    // 返回svg
    return svgCaptchaData;
  }

  // 生成图片验证信息
  createSvgCaptcha(): { svgCaptchaData: string; svgCaptchaText: string } {
    // 创建验证码
    const initialSvgCaptcha = svgCaptcha.create({
      noise: 6,
      color: true,
    });
    // 验证码结果
    const svgCaptchaText = initialSvgCaptcha.text;
    // svg
    const svgCaptchaData = initialSvgCaptcha.data;
    return { svgCaptchaData, svgCaptchaText };
  }
}
