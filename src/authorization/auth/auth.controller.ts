import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserValidator } from 'src/utils/validators/users.validator';
import { User } from '../../entities';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../../common/guards/local-auth/local-auth.guard';
import { AuthExceptionsFilter } from 'src/common/filters/auth-exceptions/auth-exceptions.filter';
@Controller('auth')
@UseFilters(AuthExceptionsFilter)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  async connect(@Body() body: LoginDto, @Req() req, @Res() res) {
    const toValidate: string[] = ['username', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    const { username, password } = body;
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('/signin');
    } else {
      const user = await this.usersService.validateUser(username, password);
      if (user) {
        req.session.user = {
          id: user.getId(),
          name: user.getName(),
          role: user.getRole(),
        };
        req.flash('loginError', 'Invalid username or password');
        return res.redirect('/home');
      } else {
        return res.redirect('/signin');
      }
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
      return res.redirect('/signup');
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
