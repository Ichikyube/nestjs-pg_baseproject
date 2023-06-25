import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  matchRoles(roles: string[], userRoles: string[]) {
    return roles.some((role) => userRoles.includes(role));
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const matchRoles = this.matchRoles(roles, user.roles);
    if (!matchRoles) {
      return false;
    }
    console.log('matchRoles', matchRoles);
    console.log('roles', roles);
    console.log('user.roles', user.roles);
    console.log('user', user);
    console.log('request', request);
    console.log('context', context);
    console.log('context.getHandler()', context.getHandler());
    console.log('context.getClass()', context.getClass());
    console.log('context.switchToHttp()', context.switchToHttp());
    console.log(
      'context.switchToHttp().getRequest()',
      context.switchToHttp().getRequest(),
    );
    console.log(
      'context.switchToHttp().getResponse()',
      context.switchToHttp().getResponse(),
    );
    return matchRoles;
  }
}
