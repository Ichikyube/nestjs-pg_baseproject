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
@Catch()
export class AuthExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      request.flash('loginError', 'Please try again!');
      response.redirect('/');
    } else if (exception instanceof NotFoundException) {
      request.flash('loginFailed', 'Please try again!');
      response.redirect('/signin');
    } else if (exception instanceof BadRequestException) {
      const message: any = exception.getResponse();
      request.flash('registerError', message.message);
      response.redirect('/register');
    } else {
      response.redirect('/error');
    }
  }
}
