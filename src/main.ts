import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import flash = require('connect-flash');
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
export let app: NestExpressApplication;
async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port =
    configService.get<number>('SERVER_POR') || configService.get('PORT');

  app.use(
    session({
      secret: configService.get('SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 360000 },
    }),
  );
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use('/admin*', function (req, res, next) {
    if (req.session.user && req.session.user.role == 'admin') {
      next();
    } else {
      res.redirect('/');
    }
  });
  app.use('/account*', function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/');
    }
  });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '/public/views'));
  app.setViewEngine('hbs');
  hbs.registerHelper('loud', function (aString) {
    return aString.toUpperCase();
  });
  hbs.registerPartials(join(__dirname, '..', '/public/views/layouts/'));
  hbsUtils(hbs).registerWatchedPartials(
    join(__dirname, '..', '/public/views/layouts'),
  );

  const options = new DocumentBuilder()
    .setTitle('Documentation | Best API')
    .setDescription('The Best API documentation')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-key', in: 'header' }, 'x-key')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'authenticate')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port}/api`,
    );
  });
}
bootstrap();
