import { SetMetadata } from '@nestjs/common';

// 无需鉴权装饰器
export const IS_PUBLIC_KEY = 'isPublic';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
