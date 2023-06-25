import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
