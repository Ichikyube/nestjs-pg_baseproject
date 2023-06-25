import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = request.isAuthenticated();
    if (!isAuthenticated) {
      // Redirect to the login page
      const response = context.switchToHttp().getResponse();
      response.redirect('/signin');
      return false;
    }

    return true;
  }
}
