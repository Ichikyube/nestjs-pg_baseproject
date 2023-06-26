import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies['jwt'];
  }
};
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const accessToken = ExtractJwt.fromExtractors([cookieExtractor])(request);

      if (!accessToken)
        throw new UnauthorizedException('Access token is not set');

      return this.activate(context);
    } catch (err) {
      this.logger.error((err as Error).message);
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }
}
