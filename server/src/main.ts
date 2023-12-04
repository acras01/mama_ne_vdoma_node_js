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
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        // file on daily rotation (error only)
        new transports.DailyRotateFile({
          // %DATE will be replaced by the current date
          filename: `../logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, // don't want to zip our logs
          maxFiles: '30d', // will keep log until they are older than 30 days
        }),
        // same for all levels
        new transports.DailyRotateFile({
          filename: `../logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  const configService = app.get(ConfigService<IEnv>);
  const globalPrefix = configService.get('GLOBAL_PREFIX');
  app.set('trust proxy', 1);
  app.setGlobalPrefix(globalPrefix + '/api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, stopAtFirstError: true }),
  );
  app.enableCors();
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
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
  SwaggerModule.setup(globalPrefix + '/swagger', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
