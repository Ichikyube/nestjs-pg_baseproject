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
      request.flash('AccessError', 'Please login first!');
      console.log('yada');
      response.redirect('/signin');
    } else if (exception instanceof NotFoundException) {
      request.flash('loginError', 'Invalid username or password');
      response.redirect('/signin');
    } else if (exception instanceof BadRequestException) {
      const message: any = exception.getResponse();
      request.flash('registerError', message.message);
    } else {
      response.redirect('/error');
    }
  }
}
