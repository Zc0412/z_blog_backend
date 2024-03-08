import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport(
      this.configService.get('email'),
    );
  }

  /**
   * 发送验证码
   * @param mailDto
   */
  async sendMail(mailDto: MailDto) {
    // 测试服务是否正常;
    this.transporter.verify(async (error) => {
      if (error) {
        throw new InternalServerErrorException(error);
      }
    });
    return await this.transporter.sendMail({
      from: this.configService.get('email.auth.user'), // sender address
      to: mailDto.email, // list of receivers
      subject: mailDto.subject || '系统验证码', // Subject line
      text: mailDto.text || '', // plain text body
      html: `<p>登录验证码:<b>${mailDto.mailCode}</b></p>`, // html body
    });
  }
}
