import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class AuthExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    // response.status(status).json({
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException ||
      exception instanceof NotFoundException
    ) {
      request.flash('loginError', 'Please try again!');
      response.redirect('/signin');
    } else if (exception instanceof BadRequestException) {
      const message: any = exception.getResponse();
      request.flash('registerError', message.message);
      response.redirect('/signup');
    } else {
      response.redirect('/error');
    }
  }
}
