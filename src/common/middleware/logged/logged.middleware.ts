import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
@Injectable()
export class LoggedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const code = res.statusCode;
    const logFormat = `
      Request original url: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      Status code: ${code}
      Headers: ${JSON.stringify(req.headers)} \n`;
    if (req.isAuthenticated()) {
      res.redirect('/home');
    } else {
      res.send(logFormat);
    }
    next();
  }
}
