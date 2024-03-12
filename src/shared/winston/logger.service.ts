import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

export class AppLoggerService {
  private context?: string;
  private logger: Logger;
  public setContext(context: string): void {
    this.context = context;
  }
  constructor() {
    this.logger = createLogger({
      level: process.env.LOGGER_LEVEL, //分级
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        // new transports.File({
        //   filename: 'logs/error.log',
        //   level: 'error',
        // }),
        // new transports.File({ filename: 'logs/combined.log' }),
        // new transports.Console(),
        new transports.DailyRotateFile({
          level: 'error',
          dirname: `logs`, // 日志保存的目录
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          // 记录时添加时间戳信息
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
        }),
        new transports.DailyRotateFile({
          dirname: `logs`, // 日志保存的目录
          filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
          // 记录时添加时间戳信息
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
          ),
        }),
      ],
    });
  }
  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
