import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'alice@cool.org' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'alice' })
  password: string;
}
