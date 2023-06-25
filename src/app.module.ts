import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggedMiddleware } from './common/middleware/logged/logged.middleware';
import TypeOrmConfigService from './config/database.config';
import { AccountController } from './authorization/account/account.controller';
import { User, Product, Order, Item, Role } from './entities';
import { AuthModule } from './authorization/auth/auth.module';
import { UsersModule } from './authorization/users/users.module';
import { AdminModule } from './authorization/admin/admin.module';
import { CartController } from './features/cart/cart.controller';
import { ProductsController } from './features/products/products.controller';
import { ProductsService } from './features/products/products.service';
import { OrdersService } from './features/orders/orders.service';
import { ItemsService } from './features/items/items.service';
import { RolesService } from './authorization/roles/roles.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product, User, Order, Item, Role]),
    MulterModule.register({
      dest: './public/uploads', // specify the destination folder for uploaded files
    }),
    AuthModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [
    AppController,
    CartController,
    ProductsController,
    AccountController,
  ],
  providers: [
    AppService,
    ProductsService,
    OrdersService,
    ItemsService,
    RolesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggedMiddleware).forRoutes('*');
  }
}
