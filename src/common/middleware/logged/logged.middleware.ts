import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class LoggedMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const { statusCode: code } = res;

    res.on('close', () => {
      const contentLength = res.get('content-length');
      const logFormat = `
      Request original url: ${JSON.stringify(headers['host'])}${originalUrl}
      Method: ${method}
      IP: ${ip}
      Status code: ${code}
      contentLength: ${contentLength} \n`;
      this.logger.log(logFormat);
    });

    next();
  }
}
