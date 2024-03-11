import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// github策略
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://192.168.1.101:3303/api/v1/auth/github/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // 在这里，你可以根据profile信息来查找或创建一个用户
    // 例如: return await this.usersService.findOrCreate(profile);
    return profile;
  }
}
