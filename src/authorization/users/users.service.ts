import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  getUsers() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('ENCRYPTION') private readonly encryption: typeof bcrypt,
  ) {}

  async createUser(userData: User) {
    const hash = await this.encryption.hash(userData.password, 10);
    userData.setPassword(hash);
    const newUser = this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return { message: 'Register Successful' };
  }

  findUsersById(userId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: userId });
  }

  updateBalance(id: number, balance: number) {
    return this.userRepository.update(id, { balance: balance });
  }
  async updateUser(userId: number, request: UpdateUserDto) {
    const userExist = await this.userRepository.findOneBy({ id: userId });
    if (userExist) {
      throw new BadRequestException('data user tidak ditemukan');
    }

    userExist.setEmail(request.email);
    userExist.setPassword(request.password);
    userExist.setName(request.username);
    return this.userRepository.save(userExist);
  }
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('user tidak ditemukan');
    }
    this.userRepository.remove(user);
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ username: username });
    const validate = await this.encryption.compare(password, user.password);
    if (validate) {
      return user;
    }
    return null;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
