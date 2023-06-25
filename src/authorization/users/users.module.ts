import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'ENCRYPTION',
      useValue: bcrypt,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
