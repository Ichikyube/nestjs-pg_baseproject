import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/common/guards/authenticated/authenticated.guard';
import { LoginGuard } from 'src/common/guards/login/login.guard';
import { OrdersService } from 'src/features/orders/orders.service';
@Controller('/account')
export class AccountController {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(AuthenticatedGuard)
  @Get('/orders')
  @Render('account/orders')
  async orders(@Req() request) {
    const viewData = [];
    viewData['title'] = 'My Orders - Online Store';
    viewData['subtitle'] = 'My Orders';
    viewData['orders'] = await this.ordersService.findByUserId(
      request.session.user.id,
    );
    return { viewData };
  }
}
