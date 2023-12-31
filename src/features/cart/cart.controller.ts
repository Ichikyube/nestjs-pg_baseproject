import {
  Controller,
  Get,
  Render,
  Req,
  Redirect,
  Param,
  Body,
  Post,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { Product } from '../../entities/product.entity';
import { UsersService } from 'src/authorization/users/users.service';
import { OrdersService } from '../orders/orders.service';
import { Item } from '../../entities/item.entity';
import { Order } from '../../entities/order.entity';
import { ItemsService } from '../items/items.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated/authenticated.guard';
import { AuthExceptionsFilter } from 'src/common/filters/auth-exceptions/auth-exceptions.filter';

@Controller('cart')
@UseGuards(AuthenticatedGuard)
@UseFilters(AuthExceptionsFilter)
export class CartController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly ordersService: OrdersService,
  ) {}
  @Get('/')
  @Render('cart/index')
  async index(@Req() request) {
    let total = 0;
    let productsInCart: Product[] = null;
    const productsInSession = request.session.products;
    if (productsInSession) {
      productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );
      total = Product.sumPricesByQuantities(productsInCart, productsInSession);
    }
    const viewData = [];
    viewData['title'] = 'Cart - Online Store';
    viewData['subtitle'] = 'Shopping Cart';
    viewData['total'] = total;
    viewData['productsInCart'] = productsInCart;
    return {
      viewData: viewData,
    };
  }
  @Post('/add/:id')
  @Redirect('/cart')
  add(@Param('id') id: number, @Body() body, @Req() request) {
    let productsInSession = request.session.products;
    if (!productsInSession) {
      productsInSession = {};
    }
    productsInSession[id] = body.quantity;
    request.session.products = productsInSession;
  }
  @Get('/delete')
  @Redirect('/cart/')
  delete(@Req() request) {
    request.session.products = null;
  }

  @Get('/purchase')
  async purchase(@Req() request, @Res() response) {
    if (!request.session.user) {
      return response.redirect('/auth/signin');
    } else if (!request.session.products) {
      return response.redirect('/cart');
    } else {
      const user = await this.usersService.findUsersById(
        request.session.user.id,
      );
      const productsInSession = request.session.products;
      const productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );
      let total = 0;
      const items: Item[] = [];
      for (let i = 0; i < productsInCart.length; i++) {
        const quantity = productsInSession[productsInCart[i].getId()];
        const newItem = new Item();
        newItem.setQuantity(quantity);
        newItem.setPrice(productsInCart[i].getPrice());
        newItem.setProduct(productsInCart[i]);
        const item = await this.itemsService.createOrUpdate(newItem);
        items.push(item);
        total = total + productsInCart[i].getPrice() * quantity;
      }
      const newOrder = new Order();
      newOrder.setTotal(total);
      newOrder.setItems(items);
      newOrder.setUser(user);
      const order = await this.ordersService.createOrUpdate(newOrder);
      const newBalance = user.getBalance() - total;
      await this.usersService.updateBalance(user.getId(), newBalance);
      request.session.products = null;
      const viewData = [];
      viewData['title'] = 'Purchase - Online Store';
      viewData['subtitle'] = 'Purchase Status';
      viewData['orderId'] = order.getId();
      return response.render('cart/purchase', { viewData: viewData });
    }
  }
}
