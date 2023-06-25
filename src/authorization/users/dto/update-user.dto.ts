import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { FileEntity } from 'src/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsOptional()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email?: string | null;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  hash?: string | null;
}
