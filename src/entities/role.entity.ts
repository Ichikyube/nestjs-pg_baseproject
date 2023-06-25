import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EntityHelper } from 'src/utils/entity-helper';
import { Allow } from 'class-validator';
import { User } from 'src/entities';
@Entity()
export class Role extends EntityHelper {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable()
  users: User[];
}
