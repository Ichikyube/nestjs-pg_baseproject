import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersService } from './orders/orders.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggedMiddleware } from './common/middleware/logged/logged.middleware';
import TypeOrmConfigService from './config/database.config';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { ItemsModule } from './items/items.module';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities';
import { Order } from './orders/entities/order.entity';
import { ProductsService } from './products/products.service';
import { ProductsController } from './products/products.controller';
import { AccountController } from './account/account.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product, User, Order]),
    MulterModule.register({
      dest: './uploads', // specify the destination folder for uploaded files
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    UploadModule,
    CartModule,
    ItemsModule,
  ],
  controllers: [
    AppController,
    CartController,
    ProductsController,
    AccountController,
  ],
  providers: [AppService, ProductsService, OrdersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggedMiddleware)
      .forRoutes(
        { path: 'signin', method: RequestMethod.GET },
        { path: 'signup', method: RequestMethod.GET },
      );
  }
}
