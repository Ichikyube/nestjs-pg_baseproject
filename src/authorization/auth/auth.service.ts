import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    return await this.usersService.validate(username, password);
  }

  async register(newUser: User): Promise<{ message: any }> {
    return await this.usersService.createUser(newUser);
  }
}
