import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const ctx = context.switchToHttp();
    // const response = ctx.getResponse<Response>();
    //
    // const request = ctx.getRequest<Request>();
    // console.log(ctx);
    // 格式化相应数据
    return next.handle().pipe(
      map((data) => {
        const message = data?.message || 'success';
        if (data.data) {
          return {
            ...data,
            message,
          };
        }
        return {
          data,
          message,
        };
      }),
    );
  }
}
