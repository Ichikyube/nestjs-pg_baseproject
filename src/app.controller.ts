import {
  Controller,
  Get,
  UseGuards,
  Res,
  Render,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from './common/guards/authenticated/authenticated.guard';
import { AuthExceptionsFilter } from './common/filters/auth-exceptions/auth-exceptions.filter';
import { AppService } from './app.service';
import { UsersService } from './authorization/users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Render('index')
  index() {
    const viewData = [];
    viewData['currentTime'] = new Date();
    viewData['title'] = 'Home Page - Online Store';
    return { viewData };
  }

  @Get('about')
  @Render('about')
  about() {
    const viewData = [];
    viewData['description'] = 'This is an about page ...';
    viewData['author'] = 'Your Name';
    viewData['title'] = 'About us - Online Store';
    viewData['subtitle'] = 'About us';
    return { viewData };
  }

  @Get('signin')
  @Render('login')
  loginView(@Req() req: Request): {
    topmessage: string[];
    message: string[];
    registerSuccess: string[];
  } {
    return {
      topmessage: req.flash('AccessError'),
      message: req.flash('loginError'),
      registerSuccess: req.flash('registerMessage'),
    };
  }

  @Get('/signup')
  @Render('register')
  registerView(@Req() req: Request): { message: string[] } {
    return { message: req.flash('registerError') };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/home')
  @Render('home')
  getHome(@Req() req: Request) {
    return { user: req.user };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  @Render('profile')
  getProfile(@Req() req: Request) {
    return { user: req.user };
  }

  @Get('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return req.logout((err) => {
      if (err) console.log(err);
      res.redirect('/');
    });
  }
}
