import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { ConfigService } from '@nestjs/config';
import { IEnv } from './configs/env.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.setGlobalPrefix('back/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService<IEnv>);
  app.enableCors();
  app.use(
    session({
      secret: 'SECRET SESSION KEY',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, maxAge: 2_629_800_000 },
      store: MongoStore.create({ mongoUrl: configService.get('MONGO_URL') }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const config = new DocumentBuilder()
    .setTitle('Mama ne vdoma')
    .setDescription('Mama ne vdoma API description')
    .setVersion('0.0.1')
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('back/swagger', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
