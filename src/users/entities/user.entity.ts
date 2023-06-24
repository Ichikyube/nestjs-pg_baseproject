import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    unique: true,
    nullable: false,
    default: '',
  })
  username: string;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column()
  role: string;

  @Column()
  balance: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  getOrders(): Order[] {
    return this.orders;
  }
  setOrders(orders: Order[]) {
    this.orders = orders;
  }

  getId(): number {
    return this.id;
  }
  setId(id: number) {
    this.id = id;
  }
  getName(): string {
    return this.username;
  }
  setName(name: string) {
    this.username = name;
  }
  getEmail(): string {
    return this.email;
  }
  setEmail(email: string) {
    this.email = email;
  }
  getPassword(): string {
    return this.password;
  }
  setPassword(password: string) {
    this.password = password;
  }
  getRole(): string {
    return this.role;
  }

  setRole(role: string) {
    this.role = role;
  }
  getBalance(): number {
    return this.balance;
  }
  setBalance(balance: number) {
    this.balance = balance;
  }
}
// const entities = [User];
// export default entities;
