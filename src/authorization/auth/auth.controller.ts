import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginGuard } from 'src/common/guards/login/login.guard';
import { UserValidator } from 'src/utils/validators/users.validator';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  //@UseGuards(LoginGuard)
  @Post('/login')
  async connect(@Body() body, @Req() req, @Res() res) {
    const { username, password } = body;
    const user = await this.usersService.validateUser(username, password);
    if (user) {
      req.session.user = {
        id: user.getId(),
        name: user.getName(),
        role: user.getRole(),
      };
      return res.redirect('/');
    } else {
      return res.redirect('/signin');
    }
  }

  @Post('/store')
  @UsePipes(ValidationPipe)
  async register(
    @Body() body,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const toValidate: string[] = ['username', 'email', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    const { email, password, username } = body;
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('/auth/register');
    } else {
      const newUser = new User();
      newUser.setEmail(email);
      newUser.setPassword(password);
      newUser.setName(username);
      newUser.setRole('client');
      newUser.setBalance(1000);
      const { message } = await this.usersService.createUser(newUser);
      req.flash('registerMessage', message);
      return res.redirect('/');
    }
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Req() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
